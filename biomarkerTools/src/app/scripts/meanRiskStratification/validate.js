function validate(values) {
  var valid = true;
  var messages = [];

  thisTool.find("#errors").empty();

  var $this = document.getElementsByTagName('form').markers;
  var invalidElements = $($this).find(':invalid');

  for (var item in values) {
    var marker_value_keys = Object.keys(values[item]);
    // object will always have one option property so check for less than 2
    if (marker_value_keys.length < 2) {
      valid = false;
      messages.push('You must enter values for either option 1 or 2 in each biomarker.');
    }
    if (values[item].prob_d && values[item].ppv && values[item].npv) {
      var minProbD, maxProbD;
      var cnpv = parseFloat((1 - values[item].npv).toFixed(4));
      if (values[item].ppv > cnpv) {
        minProbD = cnpv;
        maxProbD = values[item].ppv;
      } else {
        minProbD = values[item].ppv;
        maxProbD = cnpv;
      }
      if (values[item].prob_d <= minProbD || values[item].prob_d >= maxProbD) {
        messages.push("Disease Prevalence must be between the PPV (" + values[item].ppv + ") and cNPV (" + cnpv + ").");
      }
    } else if (values[item].prob_m && values[item].sens && values[item].spec) {
      var minProbM, maxProbM;
      var cspec = parseFloat((1 - values[item].spec).toFixed(4));
      if (values[item].sens > cspec) {
        minProbM = cspec;
        maxProbM = values[item].sens;
      } else {
        minProbM = values[item].sens;
        maxProbM = cspec;
      }
      if (values[item].prob_m <= minProbM || values[item].prob_m >= maxProbM) {
        messages.push("Marker Positivity must be between the Sensitivity (" + values[item].sens + ") and the compliment of the Specificity (" + cspec + ").");
      }
    }
  }

  for (var i = 0; i != invalidElements.length; i++) {
    var text;
    valid = invalidElements[i].valid;
    var validityObj = invalidElements[i].validity;
    if (validityObj.badInput) {
      text = "The value you entered contains an invalid character. " +
        invalidElements[i].validationMessage;
    }
    if (validityObj.patternMismatch) {
      text = "The value you entered '" + invalidElements[i].value + "' contains an invalid character. " +
        invalidElements[i].validationMessage;
    }
    if (validityObj.rangeOverflow || validityObj.rangeUnderflow) {
      if (invalidElements[i].min && invalidElements[i].max) {
        text = "The value you entered '" + invalidElements[i].value + "' must be decimal value between " +
          invalidElements[i].min + " and " + invalidElements[i].max;
      }
      else if (invalidElements[i].min && !invalidElements[i].max) {
        text = "The value you entered '" + invalidElements[i].value + "' must be decimal value greater than " +
          invalidElements[i].min;
      }
      else {
        text = "The value you entered '" + invalidElements[i].value + "' must be decimal value less than " +
          invalidElements[i].max;
      }
    }
    // prevent duplicate messages
    if ($.inArray(text, messages) == -1) messages.push(text);
  }

  if (messages.length > 0) {
    valid = false;
    display_errors(messages);
  }
  else thisTool.find("#errors").fadeOut();

  return valid;
}