describe('Example', () => {
  const {device} = require('detox');

  beforeAll(async () => {
    await device.launchApp({
      newInstance: true,
      launchArgs: {detoxEnableSynchronization: 0},
    });
  });

  // beforeEach(async () => {
  //   await device.reloadReactNative();
  // });

  it('should press on the get started button', async () => {
    await element(by.id('get')).tap();
  });
  const email = 'rememberprakash@gmail.com';
  it('should type rememberprakash@gmail.com', async () => {
    const input = element(by.id('email'));
    await input.typeText(email);
  });

  const pass = '123456';
  it('should type 123456', async () => {
    const input = element(by.id('password'));
    await input.typeText(pass);
  });

  it('should press on the sign in button', async () => {
    await element(by.id('sign_in')).tap();
  });
});
