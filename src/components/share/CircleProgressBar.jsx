import React from 'react'
import { Heat  } from '@alptugidin/react-circular-progress-bar';


function SemiCircleProgressBar({ value }) {

    let value_int = (value / 5) * 100
    return (


      <Heat
        progress={value_int}
        sign={{ value: '', position: 'start' }}
        text={'Commulative GPA'}
        revertBackground={true}
        sx={{
          bgColor: '#ffffff',
          barWidth: 10,
          shape: 'half',
          valueSize: 20,
          valueWeight: 'bold',
          textSize: 9
        }}
      />

      //   <Flat  
      //     progress={value_int}
      //     // range={{ from: 0, to: 100 }}
      //     sign={{ value: value, position: 'end' }}
      //     text={'CGPA'}
      //     showMiniCircle={true}
      //     showValue={true}
      //     sx={{
      //       strokeColor: '#ff0000',
      //       barWidth: 10, 
      //       bgStrokeColor: '#ffffff',
      //       // bgColor: { value: '#000000', transparency: '20' },  
      //       shape: 'half',
      //       strokeLinecap: 'round',
      //       valueSize: 13,
      //       valueWeight: 'bold',
      //       valueColor: '#000000',
      //       valueFamily: 'Trebuchet MS',
      //       textSize: 13,
      //       textWeight: 'bold',
      //       textColor: '#000000',
      //       textFamily: 'Trebuchet MS',
      //       loadingTime: 1000,
      //       miniCircleColor: '#ff0000',
      //       miniCircleSize: 5,
      //       valueAnimation: true,
      //       intersectionEnabled: true
      //     }}
      // />

        // <Flat
        //     value={value_int}
        //     circleRatio={0.6}
        //     strokeWidth={12}
        //     styles={{
        //         root: {
        //             transform: "rotate(-108deg)",
        //         },
        //         path: { stroke: "#7D52E9", strokeLinecap: "round", strokeWidth: 12 },
        //         trail: { stroke: "rgba(128,128,200, 0.4)", strokeLinecap: "round",},
        //     }}
        // >
        //     <div style={{ fontSize: 24, marginTop: -30, textAlign:'center' }}>
        //         <strong style={{display: 'block'}}>{value}</strong>
        //         <small style={{fontSize: 12}}>Cumulative CGPA</small>
        //     </div>
        // </Flat>
    )
}

export default SemiCircleProgressBar