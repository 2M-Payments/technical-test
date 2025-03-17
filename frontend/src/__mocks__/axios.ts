const mockAxios: any = {
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    put: jest.fn(() => Promise.resolve({ data: {} })),
    delete: jest.fn(() => Promise.resolve({})),
    create: jest.fn(function () {
      return mockAxios;
    }),
  };
  
  export default mockAxios;  