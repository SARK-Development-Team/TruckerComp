// Here I copied some of the sark_move code, but it cannot be translated into JS easily.

function emailMessage(recipientEmail, subject, messagebody = null, attachments = null, CCs = null) {
    
    // what is a mailmessage in JS?
    let rawmessage = new MailMessage();
    //MimeMessage rawmessage = new MimeMessage();
    rawmessage.From = new MailAddress("wc@sarkinsurance.com", "SARK Insurance Services");
    rawmessage.To.Add(new MailAddress(recipientEmail));
    rawmessage.Subject = subject;

    rawmessage.IsBodyHtml = true;
    rawmessage.Body = messagebody.HtmlBody;

    if (attachments != null)
    {
        for (int i = 0; i < attachments.Count; i++)
        {
            rawmessage.Attachments.Add(new System.Net.Mail.Attachment(attachments[i]));
        }
        
    }

    if (CCs != null)
    {
        string CC = string.Join(',', CCs);
        rawmessage.CC.Add(CC);
    }

    var buffer = new System.IO.MemoryStream();
    MimeMessage mimeMessage = MimeMessage.CreateFromMailMessage(rawmessage);
    mimeMessage.WriteTo(buffer);
    byte[] rawbytes = new byte[buffer.Length];
    rawbytes = buffer.ToArray();

    char[] padding = { '=' };
    string returnValue = Convert.ToBase64String(rawbytes)
    .TrimEnd(padding).Replace('+', '-').Replace('/', '_');


    if (buffer.CanRead)
    {
        buffer.Dispose();
    }

    
    var message = new Google.Apis.Gmail.v1.Data.Message();
    message.Raw = returnValue;

    var request = GoogleConnect.MailService.Users.Messages;
    
    request.Send(message, "me").Execute();
}



using Google.Apis.Gmail.v1.Data;



        //The goal of the method is to try to get all the emails at once with or without email service. This async method is going to get all the emails that are stored, and get the most recent email.
        //If no emails are found, this will return null.

        //Moved to EmailInbox.cs.
        //public static async Task<LiteDBFunctions.Emails.GmailLiteDBModel> GetEmails(Client client)




        //Alright, so the Gmail API is not noob-friendly at all, probably because it is so bare bones that even I could build something better than this shit. But here's an "okay-ish"
        //explanation of what's going on.
        /*
         * Basically, a GmailMessage is split into a bunch of parts, which represent different types of data the email is supposed to have. The main stuff that we actually care about
         * is the message body, which is split into a plain-text version that has MimeType = "text/plain" and an HTML version, which has MimeType = "text/html". Since MOST of our messages use the HTML mimetype and don't have
         * a plain-text version, this is the version we can use. Furthermore, emails can have attachments, that Google stores separately from the email message. These attachments can supposedly be downloaded in real time
         * using the attachments.get() command. The issue is how MIME chooses to store all of this data. Basically, instead of storing each type as its own element in an array, each type is stored in various "multipart/*"
         * types that don't make any sense. So ExtractMessagePart() recursively looks through each message part to find the juicy information.
         * 
         * On threads and reply messages: HTML messages have a specific "gmail_quote" class that can be removed to get rid of the prior material. Plain-text messages have > before the quoted part.
         * 
         * The important thing to note is that you don't really have to "combine" content, with the exception of HTML and inline content, every MessagePart does have a complete, if confusing part of the message.
         */
        function extractMessagePart(part, htmlBody, plaintextBody, attachments, images){
            if (!part) return;
            let contentDisposition = part.Headers?.FirstOrDefault(h => h.Name == "Content-Disposition");
            if (contentDisposition != null && (contentDisposition.Value.StartsWith("attachment") || contentDisposition.Value == "inline"))
            {
                attachments.Add(new AttachmentModel() { Name = part.Filename, AttachID = part.Body.AttachmentId });
            }
            else if (part.MimeType.Contains("image/"))
        }
        // static void ExtractMessagePart(MessagePart part, ref string htmlBody, ref string plaintextBody, List<AttachmentModel> attachments, List<ImageModel> images)

            
            {
                var image = new ImageModel()
                {
                    Name = part.Filename,
                    MimeType = part.MimeType,
                    AttachID = part.Body.AttachmentId,
                    ContentID = part.Headers.Where(head => head.Name.ToLowerInvariant() == "content-id").FirstOrDefault()?.Value
                };

                if (image.ContentID != null)
                {
                    image.ContentID = image.ContentID.Replace("<", string.Empty)
                    .Replace(">", string.Empty);
                }

                images.Add(image);
            }
            else
            {
                if (part.MimeType == "text/html")
                {
                    if (htmlBody != null && part.Body != null)
                    {
                        //throw new ArgumentException("An html body already exists. Duplicate html message part.");
                    }
                    else
                    {
                        htmlBody = DecodeSection(part.Body?.Data);
                    }           
                }
                else if (part.MimeType == "text/plain")
                {
                    if (plaintextBody != null && part.Body != null)
                    {
                        //throw new ArgumentException("An plain-text body already exists. Duplicate message part.");
                    }
                    else
                    {
                        plaintextBody = DecodeSection(part.Body?.Data);
                    }      
                }
            }

            if (part.Parts != null)
            {
                foreach (var np in part.Parts)
                {
                    ExtractMessagePart(np, ref htmlBody, ref plaintextBody, attachments, images);
                }
            }
        }

function DecodeSection(base64Content) {
    if (!base64Content) return null;

    let decoded = GmailBase64toByte(base64Content);
    return Encoding.UTF8.GetString(decoded);
}


// this one is 
function GmailBase64toByte(base64Content) {
    if (!base64Content) return null;

    let padChars = (base64Content.length % 4) == 0 ? 0 : (4 - (base64Content.length % 4));
    let result = new StringBuilder(base64Content, base64Content.length + padChars);
    result.Append(String.Empty.PadRight(padChars, '='));
    result.Replace('-', '+');
    result.Replace('_', '/');

    return Convert.FromBase64String(result.ToString());
}
