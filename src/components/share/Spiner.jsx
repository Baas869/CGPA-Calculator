import spinner from '../../assets/spinner.gif'
function Spiner() {
  return <img src={spinner} alt='Loading...' style={{
    width: '100px', margin: 'auto', display: 'block'
  }} />
}

export default Spiner
