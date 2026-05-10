const nodemailer = {
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue({ messageId: 'mock-id' }),
    close: jest.fn(),
  }),
};

module.exports = nodemailer;
