import { useEffect, useState } from 'react';

import { GetAppId, OpenURL } from '@app';
import { Flex } from '@mantine/core';

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
    OpenURL(url);
  };

  const handleEmailClick = () => {
    window.location.href = `mailto:info@${appName}`;
  };

  return (
    <Flex gap="sm" align="center">
      <Action
        icon="Website"
        variant="subtle"
        size="sm"
        onClick={() => handleClick(`https://${appName}`)}
        title="Visit our website"
      />
      <Action
        icon="Github"
        variant="subtle"
        size="sm"
        onClick={() => handleClick(`${github}`)}
        title="Check our GitHub"
      />
      <Action
        icon="Twitter"
        variant="subtle"
        size="sm"
        onClick={() => handleClick(`https://x.com/${twitter}`)}
        title="Follow us on X/Twitter"
      />
      <Action
        icon="Email"
        variant="subtle"
        size="sm"
        onClick={handleEmailClick}
        title="Contact us via email"
      />
    </Flex>
  );
};
