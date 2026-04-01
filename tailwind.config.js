/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      minWidth: {
        '0': '0',
        // Percentage
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
        'full': '100%',
        // Pixel
        '100' : "100px" ,
        '120' : "120px" ,
        '150' : "150px" ,
        '180' : "180px" ,
        '200' : "200px" ,
        '300' : "300px" ,
        '400' : "400px" ,
        '500' : "500px" ,
        '600' : "600px" ,
        '700' : "700px" ,
        '800' : "800px" ,
        '900' : "900px" ,
        '1000' : "1000px" ,
      },
      fontSize: {
          'xxs' : '.6rem' ,
      },
      backgroundSize: {
          '90%': '90%' ,
          '85%': '85%' ,
          '80%': '80%' ,
          '75%': '75%' ,
          '50%': '50%' ,
          '25%': '25%' ,
          '10%': '10%' ,
          '10px': '10px' ,
          '20px': '20px' ,
          '30px': '30px' ,
          '40px': '40px' ,
          '50px': '50px' ,
          '60px': '60px'
      },
      screens: {
          'print': {
              'raw': 'print'
          },
          // => @media print { ... }
      },
      // Width
      spacing: {
          'a4w' : '49rem' ,
          'a4h' : '69rem'
      }
    },
  },
  plugins: [],
}

