const { signupValidator, loginValidator } = require('../../middleware/validator/userValidator');

describe('UserValidator', () => {
  describe('signupValidator', () => {
    it('should have 3 validation rules', () => {
      expect(signupValidator).toHaveLength(3);
    });

    it('each rule should be a validator chain with run method', () => {
      signupValidator.forEach(v => {
        expect(v).toBeDefined();
        expect(typeof v.run).toBe('function');
      });
    });

    it('should reject empty firstName via validationResult', async () => {
      const { validationResult } = require('express-validator');
      const req = { body: { firstName: '', email: 'test@test.com', pass: 'pass123' } };
      await Promise.all(signupValidator.map(v => v.run(req)));
      const errors = validationResult(req);
      expect(errors.isEmpty()).toBe(false);
    });
  });

  describe('loginValidator', () => {
    it('should have 2 validation rules', () => {
      expect(loginValidator).toHaveLength(2);
    });

    it('each rule should be a validator chain with run method', () => {
      loginValidator.forEach(v => {
        expect(v).toBeDefined();
        expect(typeof v.run).toBe('function');
      });
    });
  });
});

describe('decoratorHtmlResponse', () => {
  it('should set title and html on res.locals', () => {
    const decorateHtmlResponse = require('../../middleware/decoratorHtmlResponse');
    const middleware = decorateHtmlResponse('TestPage');
    const req = {};
    const res = { locals: {} };
    const next = jest.fn();

    middleware(req, res, next);

    expect(res.locals.html).toBe(true);
    expect(res.locals.title).toBe('TestPage');
    expect(next).toHaveBeenCalled();
  });
});

describe('errorHandler', () => {
  it('should return 500 status', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const errorHandler = require('../../middleware/errorHandler');
    const err = new Error('Test error');
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    const next = jest.fn();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Something went wrong!');
  });
});
