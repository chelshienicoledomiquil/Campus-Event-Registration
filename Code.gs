function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    var name = data.name || "";
    var email = data.email || "";
    var eventDate = data.eventDate || "";
    var city = data.city || "";
    var attendees = data.attendees || "1";

    var weather = data.weather || {};
    var weatherCondition = weather.condition || "Not checked";
    var weatherTemperature = weather.temperature || "Not available";

    if (!email) {
      throw new Error("Email address is required.");
    }

    // Create the Google Doc receipt.
    var doc = DocumentApp.create("Campus Event Registration - " + name);
    var body = doc.getBody();

    body.appendParagraph("CAMPUS EVENT REGISTRATION")
        .setHeading(DocumentApp.ParagraphHeading.TITLE);

    body.appendParagraph("Registration Confirmation")
        .setHeading(DocumentApp.ParagraphHeading.HEADING1);

    body.appendParagraph("Name: " + name);
    body.appendParagraph("Email: " + email);
    body.appendParagraph("Event Date: " + eventDate);
    body.appendParagraph("Event City: " + city);
    body.appendParagraph("Number of Attendees: " + attendees);

    body.appendParagraph("Event Weather")
        .setHeading(DocumentApp.ParagraphHeading.HEADING2);

    body.appendParagraph("Condition: " + weatherCondition);
    body.appendParagraph("Temperature: " + weatherTemperature);

    body.appendParagraph("");
    body.appendParagraph("Thank you for registering for our campus event.");

    doc.saveAndClose();

    // Convert the Google Doc into a PDF.
    var pdfBlob = DriveApp.getFileById(doc.getId())
      .getAs(MimeType.PDF)
      .setName("Campus_Event_Registration_" + name + ".pdf");

    // Send the PDF receipt to the user's email.
    MailApp.sendEmail({
      to: email,
      subject: "Campus Event Registration Confirmation",
      body:
        "Hello " + name + ",\n\n" +
        "Thank you for registering for our campus event.\n\n" +
        "Your registration confirmation is attached as a PDF.\n\n" +
        "Thank you.",
      attachments: [pdfBlob]
    });

    // Optional: move the generated Google Doc to the root of My Drive.
    // The PDF is sent by email, while the Google Doc remains in Drive.

    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: "Registration completed."
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
