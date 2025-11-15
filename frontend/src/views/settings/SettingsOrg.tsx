import { ChangeEvent, useEffect, useState } from 'react';

import { GetOrgPreferences, SetOrgPreferences } from '@app';
import { FormField } from '@components';
import { FormView } from '@layout';
import { preferences } from '@models';
import { useEmitters } from '@utils';

type IndexableOrg = preferences.OrgPreferences & { [key: string]: unknown };

export const SettingsOrg = () => {
  const [formData, setFormData] = useState<IndexableOrg>({});
  const [originalData, setOriginalData] = useState<IndexableOrg>({});
  const { emitStatus } = useEmitters();

  useEffect(() => {
    GetOrgPreferences().then((data) => {
      setFormData(data as IndexableOrg);
      setOriginalData({ ...data });
    });
  }, []);

  const handleSubmit = (values: IndexableOrg) => {
    SetOrgPreferences(values).then(() => {
      setOriginalData({ ...values });
    });
  };

  const handleCancel = () => {
    setFormData({ ...originalData });
    emitStatus(`Changes were discarded`);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const formFields: FormField<Record<string, unknown>>[] = [
    {
      name: 'developerName',
      value: formData.developerName || '',
      label: 'Organization Name',
      placeholder: 'Enter your organization name',
      required: true,
    },
    {
      name: 'supportUrl',
      value: formData.supportUrl || '',
      label: 'Support',
      placeholder: 'Enter your organization support url',
      required: true,
    },
    {
      label: 'Options',
      fields: [
        {
          name: 'language',
          value: formData.language || '',
          label: 'Language',
          placeholder: 'Enter your language',
          required: true,
        },
        {
          name: 'theme',
          value: formData.theme || '',
          label: 'Theme',
          placeholder: 'Enter your theme',
          required: true,
          sameLine: true,
        },
        {
          name: 'telemetry',
          value: formData.telemetry ? 'true' : 'false',
          label: 'Telemetry',
          placeholder: 'Enter your telemetry',
          sameLine: true,
          inputType: 'checkbox',
          type: 'boolean',
        },
        {
          name: 'logLevel',
          value: formData.logLevel || '',
          label: 'Log Level',
          placeholder: 'Enter your log level',
          required: true,
        },
        {
          name: 'experimental',
          value: formData.experimental ? 'true' : 'false',
          label: 'Experimental',
          placeholder: 'Enter your experimental',
          sameLine: true,
          inputType: 'checkbox',
          type: 'boolean',
        },
        {
          name: 'version',
          value: formData.version || '',
          label: 'Version',
          placeholder: 'Enter your version',
          required: true,
          readOnly: true,
          sameLine: true,
        },
      ],
    },
  ];

  return (
    <FormView<IndexableOrg>
      title="Update / Manage Your Settings"
      formFields={formFields}
      onSubmit={handleSubmit}
      onChange={handleChange}
      onCancel={handleCancel}
    />
  );
};
