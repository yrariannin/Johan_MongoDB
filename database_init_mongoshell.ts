use Johan /// this will point to the database, mine is named "Johan", you will change it to your database name
/// if your database does not exist it will create it.
/// create collection for specimens
db.createCollection("specimens", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "_id",
        "company_name",
        "company_site",
        "disassembly_day",
        "installation_date",
        "nominal_diametre",
        "nominal_thickness",
        "receipt_day",
        "specimen_id",
        "specimen_name"
      ],
      properties: {
        _id: {
          bsonType: "objectId",
          description: "must be a valid ObjectId"
        },
        company_name: {
          bsonType: "string"
        },
        company_site: {
          bsonType: "string"
        },
        disassembly_day: {
          bsonType: "date",
          description: "must be a valid ISODate"
        },
        installation_date: {
          bsonType: "date",
          description: "must be a valid ISODate"
        },
        nominal_diametre: {
          bsonType: "double",
          minimum:0,
          exclusiveMinimum:true,
          description: "must be a number strictly greater than 0"
        },
        nominal_thickness: {
          bsonType: "double",
          minimum:0,
          exclusiveMinimum: true,
          description: "must be a number strictly greater than 0"
        },
        receipt_day: {
          bsonType: "date",
          description: "must be a valid ISODate"
        },
        specimen_id: {
          bsonType: "string"
        },
        specimen_name: {
          bsonType: "string"
        }
      }
    }
  },
  validationAction: "error"
})

/// create collection for measurement set ups
db.createCollection("exp_set_up", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "_id",
        "set_up_id",
        "set_up_name",
        "frequency",
        "amplitude",
        "phase",
        "waveform"
      ],
      properties: {
        _id: {
          bsonType: "objectId",
          description: "must be a valid ObjectId"
        },
        set_up_id: {
          bsonType: "string"
        },
        set_up_name: {
          bsonType: "string"
        },
        frequency: {
          bsonType: "double",
          minimum:0,
          exclusiveMinimum:true,
          description: "must be a number strictly greater than 0"
        },
        amplitude: {
          bsonType: "double",
          minimum:0,
          exclusiveMinimum: true,
          description: "must be a number strictly greater than 0"
        },
        phase:{
            bsonType:"double",
            minimum:-6.3,
            maximum:6.3
        },
        waveform: {
          bsonType: "string",
          enum: ["sin", "cos", "sin^2","cos^2"]
        },
        description: {
          bsonType: "string"
        }
      }
    }
  },
  validationAction: "error"
})
/// Before you create the measurement db , populate your specimen and set up ones with at least one document/entry
/// get allowed specimen id values
const allowedSpecimen = db.specimens.distinct("_id");
console.log("Allowed Specimen:", allowedSpecimen);
/// get allowed set up id values
const allowedSetup = db.exp_set_up.distinct("_id");
console.log("Allowed Set-up:", allowedSetup);
/// create collection for measurements
db.createCollection("measurements", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "_id",
        "measurement_no",
        'specimen_unique_id',
        'set_up_unique_id',
        'thickness',
        'diametre',
        'measurement_location',
        'measurement_timestamp',
        'polarization_angle',
        'Data'
    ],
      properties: {
        _id: {
          bsonType: 'objectId',
          description: "must be a valid ObjectId"
        },
        measurement_no: {
          bsonType: "int",
          minimum:1
        },
        set_up_unique_id: {
          bsonType: 'objectId', 
          enum:allowedSetup
        },
        specimen_unique_id: {
          bsonType: 'objectId',
          enum:allowedSpecimen
        },
        thickness: {
          bsonType: "double",
          minimum:0,
          exclusiveMinimum:true,
          description: "must be a number strictly greater than 0"
        },
        diametre: {
          bsonType: "double",
          minimum:0,
          exclusiveMinimum: true,
          description: "must be a number strictly greater than 0"
        },
        measurement_location: {
          bsonType: "string"
        },
        measurement_timestamp:{
            bsonType: "date",
          description: "must be a valid ISODate"
        },
        polarization_angle:{
            bsonType: "double",
          minimum:0,
          maximum:90,
          description: "must be a number in the range 0 and 90 deg"
        },
        Data: {
        bsonType: "array",
        items: {
          bsonType: "array",
          items: {
            bsonType: "double"
          }
        }
      },
      }
    }
  },
  validationAction: "error"
}
)

/// shell commands for update of validation rule
const allowedSpecimen = db.specimens.distinct("_id");
const allowedSetup = db.exp_set_up.distinct("setup_id");

db.runCommand({
  collMod: "measurements",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ['specimen_unique_id','set_up_unique_id'],
      properties: {
        specimen_unique_id: {
          bsonType: "string",
          enum: allowedSpecimen, // dynamically inserted list
          description: "must be one of the allowed specimen IDs"
        },
        set_up_unique_id: {
          bsonType: "string",
          enum: allowedSetup,
          description: "must be one of the allowed setup IDs"
        }
      }
    }
  },
  validationAction: "error"
});
