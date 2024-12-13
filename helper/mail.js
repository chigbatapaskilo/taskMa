exports.forgetPasswordtemplate = (forgetPasswordLink) => {
    return `
        <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Welcome to [boss wear]</title>
        <style>
           body {
          font-family: Arial, sans-serif;
          text-align: center;
               }
  
  .container {
    margin: 20px;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  h1 {
    font-size: 24px;
    margin-bottom: 10px;
  }
  
  img {
   width: 275px;
    height: 289px;
    top: 214px;
    left: 50px;
    gap: 30px;
    opacity: 0px;
  }
  .button {
    width: 325px;
    height: 50px;
    top: 554px;
    left: 25px;
    gap: 0px;
    border-radius: 10px 0px 0px 0px;
    opacity: 0px;
    background-color: #007bff;
    color: #fff;
    cursor:pointer;
  }
        </style>
    </head>
    <body>
  <html>
  <body>
    <div class="container">
      <h1>Reset Password</h1> 
      <img src="https://res.cloudinary.com/dhg1hqkmm/image/upload/v1729291905/bej1pefv1qmfp1wom97j.png" >
      <a href="${forgetPasswordLink}">
      <button>Reset password</button>
    </div>
    </body>
    </html>
        `;
  };
  