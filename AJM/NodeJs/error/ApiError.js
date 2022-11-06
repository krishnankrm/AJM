class ApiError {
  constructor(code, message) {
    this.code = code;
    this.message = message;
  }
  
  static UnAuthorizedRequest() {
    return new ApiError(208, {message:'Failure Login'});
  }
  static DbQuerryError() {
    return new ApiError(208, {message:'Database Query Error'});
  }
  static DbConnectError() {
    return new ApiError(208, {message:'Database connection Error'});
  }
  static NoDAta() {
    return new ApiError(208, {message:'No data'});
  }
  

}

module.exports = ApiError;