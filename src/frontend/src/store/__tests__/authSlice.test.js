import authReducer, { clearError, login, logout, register } from '../authSlice';

describe('authSlice', () => {
  const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  };

  describe('reducers', () => {
    it('should return initial state', () => {
      expect(authReducer(undefined, { type: 'unknown' })).toEqual(
        expect.objectContaining({
          loading: false,
          error: null,
        })
      );
    });

    it('should handle clearError', () => {
      const stateWithError = {
        ...initialState,
        error: { code: 'TEST_ERROR', message: 'Test error' },
      };
      const result = authReducer(stateWithError, clearError());
      expect(result.error).toBeNull();
    });
  });

  describe('register async thunk', () => {
    it('should handle pending state', () => {
      const action = { type: register.pending.type };
      const state = authReducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled state', () => {
      const mockUser = { id: '1', email: 'test@test.com', displayName: 'Test User' };
      const mockToken = 'mock-jwt-token';
      const action = {
        type: register.fulfilled.type,
        payload: { user: mockUser, token: mockToken },
      };
      const state = authReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe(mockToken);
    });

    it('should handle rejected state', () => {
      const mockError = { code: 'EMAIL_EXISTS', message: 'Email already exists' };
      const action = {
        type: register.rejected.type,
        payload: mockError,
      };
      const state = authReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toEqual(mockError);
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('login async thunk', () => {
    it('should handle pending state', () => {
      const action = { type: login.pending.type };
      const state = authReducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled state', () => {
      const mockUser = { id: '1', email: 'test@test.com', displayName: 'Test User' };
      const mockToken = 'mock-jwt-token';
      const action = {
        type: login.fulfilled.type,
        payload: { user: mockUser, token: mockToken },
      };
      const state = authReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe(mockToken);
    });

    it('should handle rejected state', () => {
      const mockError = { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' };
      const action = {
        type: login.rejected.type,
        payload: mockError,
      };
      const state = authReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toEqual(mockError);
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('logout async thunk', () => {
    it('should handle fulfilled state', () => {
      const loggedInState = {
        user: { id: '1', email: 'test@test.com' },
        token: 'mock-token',
        isAuthenticated: true,
        loading: false,
        error: null,
      };
      const action = { type: logout.fulfilled.type };
      const state = authReducer(loggedInState, action);
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('state transitions', () => {
    it('should properly transition from loading to authenticated', () => {
      let state = initialState;

      // Start login
      state = authReducer(state, { type: login.pending.type });
      expect(state.loading).toBe(true);

      // Complete login
      state = authReducer(state, {
        type: login.fulfilled.type,
        payload: { user: { id: '1' }, token: 'token' },
      });
      expect(state.loading).toBe(false);
      expect(state.isAuthenticated).toBe(true);
    });

    it('should properly handle login failure', () => {
      let state = initialState;

      // Start login
      state = authReducer(state, { type: login.pending.type });
      expect(state.loading).toBe(true);

      // Login fails
      state = authReducer(state, {
        type: login.rejected.type,
        payload: { code: 'ERROR', message: 'Failed' },
      });
      expect(state.loading).toBe(false);
      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBeTruthy();
    });
  });
});
