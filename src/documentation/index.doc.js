import { name } from "ejs";
import { Router } from "express";
import { serve, setup } from "swagger-ui-express";

const docrouter = Router();

const options = {
  openapi: "3.0.1",
  info: {
    title: "Digital Retransfer APIs documentation",
    version: "1.0.0",
    description: "Digital Retransfer APIs documentation",
  },
  basePath: "/api",
  security: [
    {
      bearerAuth: [],
    },
  ],
  tags: [
    { name: "System Authontication", description: "" },
    { name: "Users", description: "Users" },
    { name: "notification", description: "notification" },
    { name: "address", description: "address" },
    { name: "healthcenter", description: "healthcenter" },
    { name: "Borns", description: "Endpoints for managing born records" },
    { name: "Babies", description: "Endpoints for managing baby records" },
    { name: "Appointments", description: "Endpoints for Appointments  records" },
    { name: "Appointment Feedback", description: "Appointment Feedback" },
    { name: "businesses", description: "businesses" },
    { name: "settings", description: "settings" },
    
    
  ],
  paths: {
    "/api/v1/auth/login": {
      post: {
        tags: ["System Authontication"],
        summary: "Login a user",
        description: "Login a user",
        operationId: "loginUser",
        security: [],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/User",
              },
              example: {
                email: "florenceinjesus@gmail.com",
                password: "1234",
              },
            },
            required: true,
          },
        },
        responses: {
          200: {
            description: "User logged in successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    "/api/v1/users/addUser": {
      post: {
        tags: ["Users"],
        summary: "Add a user",
        description: "Add a user",
        operationId: "addOneUser",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/User",
              },
              example: {
                firstname: "John",
                lastname: "Doe",
                email: "test@example.com",
                phone: "+250784366616",
                role: "data_manager/head_of_community_workers_at_helth_center/doctor/nurse",
                gender: "Male",
                healthCenterId:"1"
              },
            },
            required: true,
          },
        },
        responses: {
          201: {
            description: "User created successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    "/api/v1/users": {
      get: {
        tags: ["Users"],
        summary: "Get all users",
        description: "Get all users",
        operationId: "getAllUsers",
        responses: {
          200: {
            description: "User deleted successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/users/statistics": {
      get: {
        tags: ["Users"],
        summary: "Get all statistics",
        description: "Get all statistics",
        operationId: "getAllstatistics",
        responses: {
          200: {
            description: "User statistics retrieved successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },


    "/api/v1/users/{id}": {
      get: {
        tags: ["Users"],
        summary: "Get a user",
        description: "Get a user",
        operationId: "getOneUser",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "User's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "User deleted successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    "/api/v1/users/update/{id}": {
      put: {
        tags: ["Users"],
        summary: "Update a user",
        description: "Update a user",
        operationId: "updateOneUser",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "User's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/User",
              },
              example: {
                firstname: "John",
                lastname: "Doe",
                email: "test@example.com",
                phone: "08012345678",
              },
            },
            "multipart/form-data": {
              schema: {
                $ref: "#/components/schemas/User",
              },
            },
          },
        },
        responses: {
          200: {
            description: "User deleted successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    "/api/v1/users/changePassword": {
      put: {
        tags: ["Users"],
        summary: "change  user password",
        description: "change  user password  for current loged in user !! ",
        operationId: "change-passwordr",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/User",
              },
              example: {
                oldPassword: "oldp",
                newPassword: "newp",
                confirmPassword: "cpass",
               
              },
            },
          },
        },
        responses: {
          200: {
            description: "User password updated  successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    "/api/v1/users/check": {
      post: {
        tags: ["Users"],
        summary: "Get  users user by email by email and send code",
        description: "Get all users",
        operationId: "getAllUserscheck",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/User",
              },
              example: {
                email: "cedrickhakuzimana.com",                    
              },
            },
            required: true,
          },
        },
        responses: {
          200: {
            description: "User retrived successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    "/api/v1/users/code/{email}": {
      post: {
        tags: ["Users"],
        summary: "check code !",
        description: "checking code send thrugth email",
        operationId: "code",
        parameters: [
          {
            name: "email",
            in: "path",
            description: "User's email",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/User",
              },
              example: {
                code: "10000",                    
              },
            },
            required: true,
          },
        },
        responses: {
          200: {
            description: "User retrived successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    "/api/v1/users/resetPassword/{email}": {
      put: {
        tags: ["Users"],
        summary: "reset  user password",
        description: "reset  user password  !! ",
        operationId: "reset-passwordr",
        parameters: [
          {
            name: "email",
            in: "path",
            description: "User's email",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/User",
              },
              example: {
                newPassword: "newp",
                confirmPassword: "cpass",
               
              },
            },
          },
        },
        responses: {
          200: {
            description: "User password updated  successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/users/delete/{id}": {
      delete: {
        tags: ["Users"],
        summary: "Delete a user",
        description: "Delete a user",
        operationId: "deleteOneUser",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "User's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "User deleted successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    "/api/v1/users/activate/{id}": {
      put: {
        tags: ["Users"],
        summary: "Activate a user",
        description: "Activate a user",
        operationId: "activateOneUser",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "User's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "User activated successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/users/deactivate/{id}": {
      put: {
        tags: ["Users"],
        summary: "Deactivate a user",
        description: "Deactivate a user",
        operationId: "deactivateOneUser",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "User's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "User deactivated successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    "/api/v1/businesses/all": {
      get: {
        tags: ["businesses"],
        summary: "Get all businesses",
        description: "Get all businesses",
        operationId: "getAllbusinesses",
        responses: {
          200: {
            description: "businesses fetched successfully",
          },
         
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },


    "/api/v1/borns/notification/switch": {
      get: {
        tags: ["settings"],
        summary: "Update a notification",
        description: "Update a notification",
        operationId: "notify",

        responses: {
          200: {
            description: "setting deleted successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: " not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/borns/notification/get": {
      get: {
        tags: ["settings"],
        summary: "Update a notification",
        description: "Update a notification",
        operationId: "getnotify",

        responses: {
          200: {
            description: " deleted successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: " not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    "/api/v1/notification/": {
      get: {
        tags: ["notification"],
        summary: "Get a notification",
        description: "Get a notification",
        operationId: "getOneNotification",
    
        responses: {
          200: {
            description: " notifications retrieved successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    "/api/v1/notification/read-all": {
      put: {
        tags: ["notification"],
        summary: "mark read a notification",
        description: "read notification",
        operationId: "getreadNotification",
  
        responses: {
          200: {
            description: " notifications marhed as read successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    "/api/v1/notification/read/{id}": {
      put: {
        tags: ["notification"],
        summary: "mark one read a notification",
        description: "read one notification",
        operationId: "onereadNotification",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "notification's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
  
        responses: {
          200: {
            description: "notifications marhed as read successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    "/api/v1/notification/read/{id}": {
      put: {
        tags: ["notification"],
        summary: "read all a notification",
        description: "read all notification",
        operationId: "read_all_notification",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "notification's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],

  
        responses: {
          200: {
            description: "notifications marhed as read successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    "/api/v1/notification/delete/{id}": {
      delete: {
        tags: ["notification"],
        summary: "delete a notification",
        description: "delete a notification",
        operationId: "deleteOnenotification",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "notification's id",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],

       
        responses: {
          200: {
            description: "notification deleted successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },
    "/api/v1/notification/delete-all": {
      delete: {
        tags: ["notification"],
        summary: "delete all notification",
        description: "delete all notification",
        operationId: "deleteALLnotification",
        responses: {
          200: {
            description: "notification deleted successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },


    "/api/v1/address/": {
      get: {
        tags: ["address"],
        summary: "Get a address",
        description: "Get a address",
        operationId: "address",
    
        responses: {
          200: {
            description: "address deleted successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    "/api/v1/healthcenters": {
      get: {
        tags: ["healthcenter"],
        summary: "Get all health centers",
        description: "Retrieve a list of all health centers.",
        operationId: "getAllHealthCenters",
        responses: {
          200: {
            description: "List of health centers retrieved successfully",
          },
          500: {
            description: "Server error",
          },
        },
      },
      post: {
        tags: ["healthcenter"],
        summary: "Create a new health center",
        description: "Add a new health center to the database.",
        operationId: "createHealthCenter",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/HealthCenter",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Health center created successfully",
          },
          400: {
            description: "Invalid request data",
          },
        },
      },
    },
    "/api/v1/healthcenters/{id}": {
      get: {
        tags: ["healthcenter"],
        summary: "Get a health center by ID",
        description: "Retrieve details of a specific health center.",
        operationId: "getHealthCenterById",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          200: {
            description: "Health center details retrieved successfully",
          },
          404: {
            description: "Health center not found",
          },
        },
      },
      put: {
        tags: ["healthcenter"],
        summary: "Update a health center",
        description: "Modify details of an existing health center.",
        operationId: "updateHealthCenter",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/HealthCenter",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Health center updated successfully",
          },
          404: {
            description: "Health center not found",
          },
        },
      },
      delete: {
        tags: ["healthcenter"],
        summary: "Delete a health center",
        description: "Remove a health center from the system.",
        operationId: "deleteHealthCenter",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          200: {
            description: "Health center deleted successfully",
          },
          404: {
            description: "Health center not found",
          },
        },
      },
    },
    "/api/v1/borns": {
      get: {
        tags: ["Borns"],
        summary: "Get all born records",
        description: "Retrieves a list of all born records, including associated health centers, sectors, and appointments.",
        responses: {
          200: { description: "Successful response" },
          500: { description: "Internal server error" },
        },
      },
      post: {
        tags: ["Borns"],
        summary: "Add a new born record",
        description: "Creates a new born record along with associated baby records.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Born" },
              example: {
                "dateOfBirth": "2025-03-19",
                "healthCenterId": 1,
                "motherName": "Jane Doe",
                "motherPhone": "+250788123456",          
                "fatherName": "John Doe",
                "fatherPhone": "+250788654321",
                "babyCount": 2,
                "deliveryType": "C-section",
                "delivery_place": "Home",
                "leave": "yes",
                "dateofDischarge": "2025-03-20",
                "dateofvisit": "2025-03-19",
                "sector_id": 27,
                "cell_id": 5,
                "village_id": 3,
                "comment":"comments on visit",
                "babies": [
                  {
                    "name": "Baby One",
                    "gender": "Male",
                    "birthWeight": 3.2,
                    "dischargebirthWeight": 3.0,
                    "medications": [
                      {
                        "name": "Vitamin K",
                        "dose": "1mg",
                        "frequency": "Once"
                      }
                    ]
                  },
                  {
                    "name": "Baby Two",
                    "gender": "Female",
                    "birthWeight": 2.8,
                    "dischargebirthWeight": 2.7,
                    "medications": [
                      {
                        "name": "Hepatitis B vaccine",
                        "dose": "0.5ml",
                        "frequency": "Once"
                      }
                    ]
                  }
                ]
              }
            }
          }
        },
        responses: {
          201: { description: "Born record created successfully" },
          400: { description: "Invalid input data" },
          500: { description: "Internal server error" }
        }
      }
      
    },
    "/api/v1/borns/{id}": {
      get: {
        tags: ["Borns"],
        summary: "Get a single born record",
        description: "Retrieves a specific born record by ID, including associated details.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID of the born record",
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: { description: "Successful response" },
          404: { description: "Born record not found" },
          500: { description: "Internal server error" },
        },
      },
      put: {
        tags: ["Borns"],
        summary: "Update a born record",
        description: "Updates an existing born record by ID.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID of the born record",
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Born" },
            },
          },
        },
        responses: {
          200: { description: "Born record updated successfully" },
          404: { description: "Born record not found" },
          500: { description: "Internal server error" },
        },
      },
      delete: {
        tags: ["Borns"],
        summary: "Delete a born record",
        description: "Removes a specific born record from the database.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID of the born record",
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: { description: "Born record deleted successfully" },
          404: { description: "Born record not found" },
          500: { description: "Internal server error" },
        },
      },
    },

      "/api/v1/borns/approve/{id}": {
        put: {
          tags: ["Borns"],
          summary: "Approve a born record",
          description: "Marks a specific born record as approved by updating its status.",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "ID of the born record",
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: {
              description: "Born record approved successfully",
            },
            404: {
              description: "Born record not found",
            },
            500: {
              description: "Internal server error",
            },
          },
        },
      },
    
      "/api/v1/borns/reject/{id}": {
        put: {
          tags: ["Borns"],
          summary: "Reject a born record",
          description: "Marks a specific born record as rejected by updating its status.",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "ID of the born record",
              schema: { type: "integer" },
            },
          ],
          requestBody: {
            required: false,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    rejectReason: {
                      type: "string",
                      example: "Missing required fields",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Born record rejected successfully",
            },
            404: {
              description: "Born record not found",
            },
            500: {
              description: "Internal server error",
            },
          },
        },
      },
    
    
    

    "/api/v1/borns/report/generated": {
      get: {
        tags: ["Borns"],
        summary: "Get all report",
        description: "Get all report",
        operationId: "report",
        parameters: [
          {
            name: "fromDate",
            in: "query",
            description: "Start date for the report (format: YYYY-MM-DD)",
            required: false,
            schema: {
              type: "string",
              format: "date",
            },
          },
          {
            name: "toDate",
            in: "query",
            description: "End date for the report (format: YYYY-MM-DD)",
            required: false,
            schema: {
              type: "string",
              format: "date",
            },
          },
        ],
        responses: {
          200: {
            description: "User report retrieved successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Something went wrong",
          },
        },
      },
    },

    // 🔵 BABIES ROUTES
    "/api/v1/babies": {
      get: {
        tags: ["Babies"],
        summary: "Get all baby records",
        description: "Retrieves a list of all baby records with associated birth details.",
        responses: {
          200: { description: "Successful response" },
          500: { description: "Internal server error" },
        },
      },
      post: {
        tags: ["Babies"],
        summary: "Add a new baby record",
        description: "Creates a new baby record under a specific born record.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Baby" },
            },
          },
        },
        responses: {
          201: { description: "Baby record created successfully" },
          400: { description: "Invalid input data" },
          500: { description: "Internal server error" },
        },
      },
    },
    "/api/v1/babies/{id}": {
      get: {
        tags: ["Babies"],
        summary: "Get a single baby record",
        description: "Retrieves a specific baby record by ID.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID of the baby record",
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: { description: "Successful response" },
          404: { description: "Baby record not found" },
          500: { description: "Internal server error" },
        },
      },
      put: {
        tags: ["Babies"],
        summary: "Update a baby record",
        description: "Updates an existing baby record by ID.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID of the baby record",
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Baby" },
            },
          },
        },
        responses: {
          200: { description: "Baby record updated successfully" },
          404: { description: "Baby record not found" },
          500: { description: "Internal server error" },
        },
      },
      delete: {
        tags: ["Babies"],
        summary: "Delete a baby record",
        description: "Removes a specific baby record from the database.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID of the baby record",
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: { description: "Baby record deleted successfully" },
          404: { description: "Baby record not found" },
          500: { description: "Internal server error" },
        },
      },
    },

    "/api/v1/appointments": {
      post: {
        tags: ["Appointments"],
        summary: "Create a new appointment",
        operationId: "createAppointment",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Appointment",
              },
              example: {
                bornId: 1,
                date: "2024-03-20",
                time: "14:00",
                purpose: "Vaccination",
                status: "Scheduled",
              },
            },
          },
        },
        responses: {
          201: { description: "Appointment created successfully" },
          500: { description: "Internal server error" },
        },
      },
      get: {
        tags: ["Appointments"],
        summary: "Get all appointments",
        operationId: "getAppointments",
        responses: {
          200: { description: "List of appointments" },
          500: { description: "Internal server error" },
        },
      },
    },
    "/api/v1/appointments/{id}": {
      get: {
        tags: ["Appointments"],
        summary: "Get an appointment by ID",
        operationId: "getAppointmentById",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          200: { description: "Appointment found" },
          404: { description: "Appointment not found" },
          500: { description: "Internal server error" },
        },
      },
      put: {
        tags: ["Appointments"],
        summary: "Update an appointment",
        operationId: "updateAppointment",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Appointment" },
              example: {
                bornId: 1,
                date: "2024-03-22",
                time: "15:00",
                purpose: "Checkup",
                status: "Completed",
              },
            },
          },
        },
        responses: {
          200: { description: "Appointment updated successfully" },
          404: { description: "Appointment not found" },
          500: { description: "Internal server error" },
        },
      },
      delete: {
        tags: ["Appointments"],
        summary: "Delete an appointment",
        operationId: "deleteAppointment",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          200: { description: "Appointment deleted successfully" },
          404: { description: "Appointment not found" },
          500: { description: "Internal server error" },
        },
      },
    },


    "/api/v1/appointmentFeedbacks": {
      get: {
        tags: ["Appointment Feedback"],
        summary: "Get all appointment feedbacks",
        description: "Retrieve a list of all appointment feedbacks",
        responses: {
          200: { description: "List retrieved successfully" },
          500: { description: "Internal server error" },
        },
      },
      post: {
        tags: ["Appointment Feedback"],
        summary: "Create a new appointment feedback",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AppointmentFeedback" },
              example: {
                babyId: 1,
                appointmentId: 3,
                weight: 3.5,
                feedback: "Healthy baby, no issues.",
                nextAppointmentDate: "2024-09-15",
                status: "Healthy",
              },
            },
          },
        },
        responses: {
          201: { description: "Feedback created successfully" },
          500: { description: "Internal server error" },
        },
      },
    },
    "/api/v1/appointmentFeedbacks/{id}": {
      get: {
        tags: ["Appointment Feedback"],
        summary: "Get a specific appointment feedback",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          200: { description: "Feedback retrieved successfully" },
          404: { description: "Feedback not found" },
          500: { description: "Internal server error" },
        },
      },
      put: {
        tags: ["Appointment Feedback"],
        summary: "Update an appointment feedback",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AppointmentFeedback" },
              example: {
                weight: 4.0,
                feedback: "Improved condition.",
                nextAppointmentDate: "2024-09-20",
                status: "Follow-up required",
              },
            },
          },
        },
        responses: {
          200: { description: "Feedback updated successfully" },
          404: { description: "Feedback not found" },
          500: { description: "Internal server error" },
        },
      },
      delete: {
        tags: ["Appointment Feedback"],
        summary: "Delete an appointment feedback",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          200: { description: "Feedback deleted successfully" },
          404: { description: "Feedback not found" },
          500: { description: "Internal server error" },
        },
      },
    },

  },

  components: {
    schemas: {
      User: {
        type: "object",
        properties: {
          firstname: {
            type: "string",
            description: "User's firstname",
          },
          lastname: {
            type: "string",
            description: "User's lastname",
          },
          username: {
            type: "string",
            description: "User's names",
          },
          gender: {
            type: "string",
            description: "User's gender",
          },
          dob: {
            type: "string",
            description: "User's date of birth",
          },
          address: {
            type: "string",
            description: "User's address",
          },
          phone: {
            type: "string",
            description: "User's phone number",
          },
          role: {
            type: "string",
            description: "User's role",
          },
          image: {
            type: "string",
            description: "User's post image",
            format: "binary",
          },
          email: {
            type: "string",
            description: "User's email",
          },
          password: {
            type: "string",
            description: "User's password",
          },
          confirm_password: {
            type: "string",
            description: "User's confirm password",
          },
          province_id: {
            type: "string",
            description: "User's province_id",
          },
          district_id: {
            type: "string",
            description: "User's district_id",
          },
          sector_id: {
            type: "string",
            description: "User's sector_id",
          },
          cell_id: {
            type: "string",
            description: "User's cell_id",
          },
          village_id: {
            type: "string",
            description: "User's village_id",
          },
        },
      },
      HealthCenter: {
        type: "object",
        required: ["name", "sectorId"],
        properties: {
     
          name: { type: "string", example: "Kigali Health Center" },
          sectorId: { type: "integer", example: 10 },
        },
      },
      Born: {
        type: "object",
        properties: {
          dateOfBirth: { type: "string", format: "date" },
          healthCenterId: { type: "integer" },
          motherName: { type: "string" },
          motherPhone: { type: "string" },
          fatherName: { type: "string" },
          fatherPhone: { type: "string" },
          deliveryType: { type: "string" },
          delivery_place:{type: "string"},
          status: { type: "string" },
          comment: { type: "string" },
          sector_id: { type: "integer" },
          cell_id: { type: "integer" },
          village_id: { type: "integer" },
          leave: { type: "string" },
          dateofDischarge: { type: "string", format: "date" },
          dateofvisit: { type: "string", format: "date" },

        },
      },
      Baby: {
        type: "object",
        properties: {
          bornId: { type: "integer" },
          name: { type: "string" },
          gender: { type: "string" },
          birthWeight: { type: "number" },
          dischargebirthWeight: { type: "number" },
          medications: { type: "array", items: { type: "string" } },
        },
      },
      Appointment: {
        type: "object",
        properties: {
          bornId: { type: "integer", description: "Foreign key to Borns table" },
          date: { type: "string", format: "date", description: "Appointment date" },
          time: { type: "string", format: "time", description: "Appointment time" },
          purpose: { type: "string", description: "Purpose of the appointment" },
          status: { type: "string", enum: ["Scheduled", "Completed", "Canceled"], description: "Appointment status" },
       
        },
      },
      AppointmentFeedback: {
        type: "object",
        properties: {
          babyId: { type: "integer", description: "Foreign key to Babies" },
          appointmentId: { type: "integer", description: "Foreign key to Appointments" },
          weight: { type: "number", format: "float", description: "Baby's weight at appointment" },
          feedback: { type: "string", description: "Doctor's feedback" },
          nextAppointmentDate: { type: "string", format: "date", description: "Suggested next visit" },
          status: { type: "string", description: "Status like Healthy, Follow-up required" },
        },
      },
    
    
  


    
    },

    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

docrouter.use("/", serve, setup(options));

export default docrouter;
