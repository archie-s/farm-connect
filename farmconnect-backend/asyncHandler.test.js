const asyncHandler = require('../../src/utils/asyncHandler');

describe('AsyncHandler Utility', () => {
  it('should handle successful async function', async () => {
    const mockReq = {};
    const mockRes = { json: jest.fn() };
    const mockNext = jest.fn();

    const asyncFunction = async (req, res) => {
      res.json({ success: true });
    };

    const wrappedFunction = asyncHandler(asyncFunction);
    await wrappedFunction(mockReq, mockRes, mockNext);

    expect(mockRes.json).toHaveBeenCalledWith({ success: true });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should handle async function that throws error', async () => {
    const mockReq = {};
    const mockRes = {};
    const mockNext = jest.fn();
    const testError = new Error('Test error');

    const asyncFunction = async () => {
      throw testError;
    };

    const wrappedFunction = asyncHandler(asyncFunction);
    await wrappedFunction(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(testError);
  });

  it('should handle async function that returns rejected promise', async () => {
    const mockReq = {};
    const mockRes = {};
    const mockNext = jest.fn();
    const testError = new Error('Rejected promise');

    const asyncFunction = async () => {
      return Promise.reject(testError);
    };

    const wrappedFunction = asyncHandler(asyncFunction);
    await wrappedFunction(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(testError);
  });

  it('should handle synchronous function', async () => {
    const mockReq = {};
    const mockRes = { json: jest.fn() };
    const mockNext = jest.fn();

    const syncFunction = (req, res) => {
      res.json({ sync: true });
    };

    const wrappedFunction = asyncHandler(syncFunction);
    await wrappedFunction(mockReq, mockRes, mockNext);

    expect(mockRes.json).toHaveBeenCalledWith({ sync: true });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
