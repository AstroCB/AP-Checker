# AP Checker for NYU Albert
In a nutshell, I got tired of checking Albert every day to see if my AP credits had been posted, so I wrote a tool to automate it and an accompanying website for you to try it with your own credentials.

It uses [PhantomJS](http://phantomjs.org) in tandem with [OpenShift](https://www.openshift.com) (Node.js cartridge) and [Socket.IO](http://socket.io) to generate an image of the user's transfer credit report on the server and deliver it to the user on [the client](http://apchecker-astrocb.rhcloud.com).

## Security note
The client communicates with the server through HTTP, which is an insecure connection (as OpenShift doesn't offer HTTPS compatibility). Your credentials are not being stored anywhere on the server, but they are being transferred over HTTP and as such, you should not use this tool over unsecured networks (such as public Wi-Fi), or your account may be compromised. If you must do so, I recommend changing your password afterward.
