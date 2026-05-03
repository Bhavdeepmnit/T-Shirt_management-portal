class ApiResponse {
  static success(res, data = null, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      ...(data !== null && { data })
    });
  }

  static created(res, data = null, message = 'Created successfully') {
    return res.status(201).json({
      success: true,
      message,
      ...(data !== null && { data })
    });
  }

  static error(res, message = 'Internal Server Error', statusCode = 500) {
    return res.status(statusCode).json({
      success: false,
      message
    });
  }

  static paginated(res, { data, total, page, limit, message = 'Success' }) {
    return res.status(200).json({
      success: true,
      message,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      data
    });
  }
}

module.exports = ApiResponse;
