var page = require("webpage").create(),
    args = require("system").args,
    loading = false,
    url = "https://admin.portal.nyu.edu/psp/paprod/EMPLOYEE/CSSS/c/SA_LEARNER_SERVICES.SSS_STUDENT_CENTER.GBL?FolderPath=PORTAL_ROOT_OBJECT.NYU_STUDENT_CTR&IsFolder=false&IgnoreParamTempl=FolderPath%2cIsFolder",
    user = args[1], // Get userid & pass from command line arguments
    pass = args[2];
var steps = [
    function() {
      // Initialize page
        console.log("Preparing report for " + user);
        page.open(url);
    },
    function() {
      // Log in
        page.evaluate(function(credentials) {
            // Secure credentials (subject to change)
            document.getElementById("userid").value = credentials.username;
            document.getElementById("pwd").value = credentials.password;
            submitAction(document.login);
        }, {
            username: user,
            password: pass
        }); // Pass credentials to evaluate() to preserve existence in scope
    },
    function() {
      // Load the report
        /*
          So at this point (logged in) there are two ways of going about this
          The first is to attempt to click all of the right buttons and toggles to get to the transfer credit page
          (you can see my attempt of doing that below), but the problem becomes waiting for the report to load
          since Albert uses a custom loading scheme from this point on
          The second option is more overt, but was more difficult to uncover; after searching through Albert's frame structure,
          I discovered the direct URL to the frame that I've been looking for this entire time, but it only works after logging in
          (which has been accomplished at this point); after this, I can simply load the page within the frame directly and screenshot
         */
        // page.evaluate(function() {
        // var frame = window.frames["TargetContent"] // Content inside frame for some horrible reason
        // var select = frame.document.getElementById("DERIVED_SSS_SCL_SSS_MORE_ACADEMICS");
        // select.value = 2025; // Transfer Credit: Report option
        // frame.submitAction_win0(frame.document.win0, 'DERIVED_SSS_SCL_SSS_GO_1'); // Directly call the submit function
        // ???? Wait for frame to load? Check if the loading indicator is visible?
        // });
        page.open("https://sis.nyu.edu/psc/csprod/EMPLOYEE/CSSS/c/SA_LEARNER_SERVICES.SS_TRCR_RPT.GBL?Page=SS_TRCR_RPT&Action=U&TargetFrameName=None");
    },
    function() {
      // Store a screenshot of the report
        page.evaluate(function() {
            console.log("Final page: " + document.title);
        });
        page.render("reports/" + user + ".png"); // Store only one unique report per user
    }
];
// Override default page behavior
page.onConsoleMessage = function(m) {
    console.log(m);
}
page.onLoadStarted = function() {
    console.log("LOADING");
    loading = true;
};

page.onLoadFinished = function() {
    loading = false;
};
var ind = 0;
var int = setInterval(function() {
    if (!loading && ind < steps.length) {
        console.log("Step " + ind);
        steps[ind]();
        ind++;
    } else if (ind >= steps.length) {
        clearInterval(int);
        phantom.exit();
    }
}, 50);
