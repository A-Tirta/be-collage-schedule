import { returnResponse } from "../interface";

class responseParsed {
  successResponse(
    data: any,
    message: string,
    status: number = 200
  ): returnResponse {
    return {
      meta: {
        status: status,
        message: message,
      },
      data: data,
    };
  }

  successResponseNoData(message: string): any {
    return {
      meta: {
        status: 200,
        message: message,
      },
    };
  }

  apiCollection(query: any, data: any): any {
    return {
      meta: {
        status: 200,
        message: "Data retrieval successfully",
        total: query.total,
        perPage: query.perPage,
        page: query.page,
        lastPage: query.totalPages,
      },
      data: data,
    };
  }

  apiItem(data: any): any {
    return {
      meta: {
        status: 200,
        message: "Data retrieval successfully",
      },
      data: data,
    };
  }

  apiCreated(data: any): any {
    return {
      meta: {
        status: 201,
        message: "Created successfully",
      },
      data: data,
    };
  }

  apiUpdated(data: any): any {
    return {
      meta: {
        status: 200,
        message: "Updated successfully",
      },
      data: data,
    };
  }

  apiDeleted() {
    return {
      meta: {
        status: 200,
        message: "Deleted successfully",
      },
    };
  }

  errorResponse(msg: string, status: number = 400, info?: any): any {
    return {
      meta: {
        status: status,
        message: msg,
      },
      ...(info && { info: info }),
    };
  }

  unknownError() {
    return {
      meta: {
        status: 500,
        message: "Unknown Error",
      },
    };
  }

  dataNotFound(msg: string = "Data not found") {
    return {
      meta: {
        status: 404,
        message: msg,
      },
    };
  }
}

export default new responseParsed();
