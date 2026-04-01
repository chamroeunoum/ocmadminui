import dateFormat from 'dateformat'
var khmer = {
  months : {
    1 : "មករា",2 : "កុម្ភៈ",3 : "មីនា",4 : "មេសា",5 : "ឧសភា",6 : "មិថុនា",7 : "កក្កដា",8 : "សីហា",9 : "កញ្ញា",10 : "តុលា",11 : "វិច្ឆិកា",12 : "ធ្នូ",
  },
  days : {
    0 : "អាទិត្យ",1 : "ច័ន្ទ",2 : "អង្គារ៍",3 : "ពុធ",4 : "ព្រហស្បត៍",5 : "សុក្រ",6 : "សៅរ៍"
  },
  numbers : {
    khmer : ['១','២','៣','៤','៥','៦','៧','៨','៩','០'] ,
    latin : ['1','2','3','4','5','6','7','8','9','0']
  }
};

export const getDay = ( day ) => {
  try {
    return parseInt( day ) >= 0 && parseInt( day ) <= 6 ? khmer.days[ parseInt( day ) ] : '' 
  } catch (error) {
    console.log(error)
  }
}

export const getMonth = (month) => {
  try {
    return parseInt( month ) >= 0 && parseInt( month ) <= 12 ? khmer.months[ parseInt( month ) ] : '' 
  } catch (error) {
    console.log(error)
  }
}

export const parseNumber = ( str ) => {
  try {
    str = str != null && str != undefined ? str.toString().trim() : ''
      if( str.length > 0 ){
        for(let i in khmer.numbers.latin){
          str = str.replaceAll( khmer.numbers.latin[i] , khmer.numbers.khmer[i] )
        }
      }
    return str
  } catch (error) {
    console.log(error)
  }
}

export const getDate = (stringDate) => {
  try {
    let date = dateFormat( new Date( stringDate )  , 'dd mm yyyy' )
    let month = dateFormat( new Date( stringDate )  , 'mm' )
    return parseNumber( dateFormat( new Date( stringDate )  , 'dd' ) + ' ' + getMonth( month ) + ' ' + dateFormat( new Date( stringDate )  , 'yyyy' ) )
  } catch (error) {
    console.log(error)
  }
}
