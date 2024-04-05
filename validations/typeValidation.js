import { getRegex } from "../utils/regexStore.js";

export const addressValidation = (address, errorPrefix) => {
  const { line1, line2, district, state, pinCode } = address;
  multiTypeValidation([
    [{ line1 }, false, "string", errorPrefix],
    [{ line2 }, false, "string", errorPrefix],
    [{ district }, false, "string", errorPrefix],
    [{ state }, false, "string", errorPrefix],
    [{ pinCode }, false, "number", errorPrefix],
  ]);
};

export const multiTypeValidation = (array) => {
  for (let field of array) {
    typeValidation(field[0], field[1], field[2], field[3]);
  }
};

export const arrayTypeValidation = (arrayObj, mandatory, type, prefix) => {
  const array = Object.values(arrayObj)[0];

  let fieldName = Object.keys(arrayObj)[0]
    .split(/(?=[A-Z])/)
    .join(" ");
  if (!prefix) {
    prefix = "";
    fieldName = fieldName.replace(/^./, function (str) {
      return str.toUpperCase();
    });
  }

  if (array === undefined) {
    if (mandatory) {
      throw new Error(prefix + " " + fieldName + " needed");
    } else {
      return;
    }
  }

  if (!(Object.prototype.toString.call(array) === "[object Array]"))
    throw new Error(prefix + " " + fieldName + " type must be an array");

  if (mandatory && array.length == 0)
    throw new Error(prefix + " " + fieldName + " cannot be an empty array");

  if (type != "any")
    for (let i in array)
      typeValidation(
        { array: array[i] },
        mandatory,
        type,
        prefix + " " + fieldName
      );
};

export const typeValidation = (value, mandatory, type, prefix) => {
  const fieldName = Object.keys(value)[0];

  let name = Object.keys(value)[0]
    .split(/(?=[A-Z])/)
    .join(" ");
  if (!prefix) {
    prefix = "";
    name = name.replace(/^./, function (str) {
      return str.toUpperCase();
    });
  }

  // const name = fieldName
  //                 .split(/(?=[A-Z])/).join(' ')
  //                 .replace(/^./, function(str){ return str.toUpperCase(); })

  const val = Object.values(value)[0];

  if (Object.values(value)[0] === undefined) {
    if (mandatory) throw new Error(prefix + " " + name + " needed");
  } else {
    if (type == "date") {
      var date_regex = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;
      if (!date_regex.test(val)) {
        throw new Error(
          prefix + " " + fieldName + " type must be date in yyyy-mm-dd format"
        );
      }
    } else if (type === "any") {
    } else if (
      type == "id" ||
      type == "date" ||
      type == "emailId" ||
      type == "password" ||
      type == "aadhaarNo" ||
      type == "productId" ||
      type == "positiveInt" ||
      type == "phoneNo"
    ) {
      // console.log('test: '+type)
      const regex = getRegex(type);
      // console.log('regex: '+regex)

      if (!regex.test(val)) {
        let errMessage = prefix + ": Invalid " + name;
        if (type == "date") errMessage += "must be in yyyy-mm-dd format";
        throw new Error(errMessage);
      }
    } else if (typeof val != type) {
      throw new Error(prefix + " " + fieldName + " type must be " + type);
    }
  }
};
