import { useEffect, useState } from 'react';

import { GetAppId } from '@app';
import { Flex } from '@mantine/core';
import { BrowserOpenURL } from '@runtime';

import { Action } from './Action';

export const Socials = () => {
  const [appName, setAppName] = useState<string>('');
  const [twitter, setTwitter] = useState<string>('');
  const [github, setGithub] = useState<string>('');

  useEffect(() => {
    GetAppId().then((id) => {
      setAppName(id.appName);
      setTwitter(id.twitter);
      setGithub(id.github);
    });
  }, []);

  const handleClick = (url: string) => {
    BrowserOpenURL(url);
  };

  const handleEmailClick = () => {
    window.location.href = `mailto:info@${appName}`;
  };

  return (
    <Flex gap="sm" align="center">
      <Action
        variant="subtle"
        size="sm"
        icon="Website"
        onClick={() => handleClick(`https://${appName}`)}
        title="Visit our website"
      />
      <Action
        variant="subtle"
        size="sm"
        icon="Github"
        onClick={() => handleClick(`${github}`)}
        title="Check our GitHub"
      />
      <Action
        variant="subtle"
        size="sm"
        icon="Twitter"
        onClick={() => handleClick(`https://x.com/${twitter}`)}
        title="Follow us on X/Twitter"
      />
      <Action
        variant="subtle"
        size="sm"
        icon="Email"
        onClick={handleEmailClick}
        title="Contact us via email"
      />
    </Flex>
  );
};
