import { generateCodebase } from './code_generator';

(async () => {
  console.log('Generating SDK...');
  await generateCodebase();
  console.log('Done');
})();
