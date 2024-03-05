class MockMailService {
  async sendMail() {
    return Promise.resolve(true);
  }
}

export default MockMailService;
