const nodemailer = require("nodemailer");
require("dotenv").config();

exports.sendSubscriptionEmail = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email address
    if (!email || !email.includes("@")) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.mail.ru",
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAILER_LOGIN,
        pass: process.env.MAILER_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.MAILER_LOGIN,
      to: email,
      subject:
        "Andrey Omelchenko, Loomhub - Exploring Junior Frontend Developer Opportunities",
      html: `
  <html>
    <body style="margin: 0; padding: 0; background-color: #f4f4f9">
      <div style="width: 100%; padding: 30px 0; background-color: #f4f4f9">
        <div
          style="
            max-width: 640px;
            background: #f7f7f7;
            margin: 0 auto;
            padding: 14px 40px;
            border-radius: 16px;
            box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
            font-family: 'Arial', sans-serif;
            color: #333;
          "
        >
          <h2 style="text-align: center; font-size: 26px; margin-bottom: 24px">
            Junior Frontend Developer - Andrey Omelchenko
          </h2>

          <p style="font-size: 15px; line-height: 1.4">Dear User,</p>

          <p style="font-size: 15px; line-height: 1.4">
            Thank you for your interest in my website and for taking the time to
            read this email. My name is Andrey and I am actively looking for web
            development job opportunities. Here is a brief overview of my skills
            and experience:
          </p>

          <h3 style="margin-top: 24px; font-size: 20px">Key Skills</h3>
          <ul style="font-size: 15px; line-height: 1.6; padding-left: 20px">
            <li>
              Frontend: HTML, CSS, JavaScript (ES6), Vue.js, Nuxt.js, Responsive
              Layouts, SSR, TailwindCSS, Pinia
            </li>
            <li>
              Backend (basic): Node.js, Express.js, MongoDB, Mongoose, JWT,
              WebSockets
            </li>
            <li>
              Other: Git, REST API, Axios, SPA principles, BEM methodology,
              Lighthouse, Mobile device emulators, SMTP
            </li>
          </ul>

          <h3 style="margin-top: 24px; font-size: 20px">Experience</h3>
          <p style="font-size: 15px; line-height: 1.4; margin-bottom: 8px">
            <strong>Web Developer</strong> at Gamerthings Startup (Feb 2023 – Jun
            2024):
          </p>
          <ul style="font-size: 15px; line-height: 1.6; padding-left: 20px">
            <li>
              Developed SPA and SSR applications from project initiation to
              deployment (Vue 3, Nuxt 3, Composition API)
            </li>
            <li>
              Built responsive web pages from Figma designs (TailwindCSS, Native
              CSS)
            </li>
            <li>Integrated backend features (MongoDB, Express.js)</li>
            <li>
              Implemented user authentication and messaging systems (JWT,
              WebSockets)
            </li>
            <li>
              Validated performance with mobile emulators and Lighthouse audits
            </li>
          </ul>

          <p
            style="
              font-size: 15px;
              line-height: 1.4;
              margin-top: 20px;
              margin-bottom: 8px;
            "
          >
            <strong>Social Media Monitoring Specialist</strong> at Petrocenter
            Association (Jun 2024 – Present):
          </p>
          <ul style="font-size: 15px; line-height: 1.6; padding-left: 20px">
            <li>
              Managing citizen inquiries and coordinating responses with various
              departments. Formal communication.
            </li>
          </ul>

          <h3 style="margin-top: 24px; font-size: 20px">Education</h3>
          <p style="font-size: 15px; line-height: 1.4; margin-bottom: 4px">
            Peter the Great St. Petersburg Polytechnic University, Department of
            International Relations
          </p>
          <p style="font-size: 15px; line-height: 1.4">
            Bachelor's Degree, International Regional Studies, 2020
          </p>

          <h3 style="margin-top: 24px; font-size: 20px">About Me</h3>
          <p style="font-size: 15px; line-height: 1.4">
            Passionate about building functional web interfaces and learning new
            technologies. Motivated to grow within a team environment, willing to
            assist others. Committed to mastering the skills and stay updated with
            best practices.
          </p>

          <h3 style="margin-top: 24px; font-size: 20px">Contacts</h3>
          <ul style="font-size: 15px; line-height: 1.6; padding-left: 20px">
            <li>
              Email:
              <a
                href="mailto:omel.andrey.99@mail.ru"
                style="color: #1a73e8; text-decoration: none"
                >omel.andrey.99@mail.ru</a
              >
            </li>
            <li>
              GitHub:
              <a
                href="https://github.com/Festralus/"
                style="color: #1a73e8; text-decoration: none"
                >github.com/Festralus</a
              >
            </li>
            <li>
              Telegram:
              <a
                href="https://t.me/andrey_omelch"
                style="color: #1a73e8; text-decoration: none"
                >@andrey_omelch</a
              >
            </li>
            <li>
              Twitter / X:
              <a
                href="https://x.com/andrey_omelch"
                style="color: #1a73e8; text-decoration: none"
                >@andrey_omelch</a
              >
            </li>
            <li>
              Portfolio:
              <a
                href="https://loomhub.vercel.app"
                style="color: #1a73e8; text-decoration: none"
                >loomhub.vercel.app</a
              >
            </li>
          </ul>

          <p style="font-size: 15px; line-height: 1.4">
            Looking forward to hearing from you!
          </p>

          <p style="font-size: 15px; line-height: 1.4">Best regards,</p>

          <p style="font-size: 15px; line-height: 1.4">Andrey Omelchenko</p>
        </div>
      </div>
    </body>
</html>

`,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: "Subscription email sent successfully",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
