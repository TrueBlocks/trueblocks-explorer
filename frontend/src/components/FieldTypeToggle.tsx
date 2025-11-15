import { Action } from '@components';
import { usePreferences } from '@hooks';

export const FieldTypeToggle = () => {
  const { setShowFieldTypes, showFieldTypes } = usePreferences();

  return (
    <Action
      icon="File"
      iconOff="Missing"
      isOn={showFieldTypes}
      onClick={() => setShowFieldTypes(!showFieldTypes)}
      title={
        showFieldTypes
          ? 'Field type display ON - Click to hide types'
          : 'Field type display OFF - Click to show types'
      }
    />
  );
};
