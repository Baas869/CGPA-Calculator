import React from 'react'
import { useState } from 'react'
import Inputs from './share/Inputs'
import Options from './share/Options'

function Form() {
    const [resultData, setResultData] = useState({
        courseTitle: '',
        credit_hours: '',
        grade: '',
    })
    const { courseTitle,  credit_hours, grade } = resultData

    const onChange = (e) => {
       setResultData((prevState) => ({
            ...prevState, [e.target.id]: e.target.value
       }))
       console.log(e.target.value)
    }

    const handleSubmit = (e) => {
        if((courseTitle = '') ||( credit_hours = '') || (grade = '')){
            console.log('123')
        }
        else{
            console.log('can submit')
        }
        
        e.preventDefault()
    }
  return (
    <form onSubmit={handleSubmit}>
        <div>
            <div>
                <label htmlFor="courseTitle" className='inputLabel'>Course Title</label>
                <Inputs onChange={onChange} type='text' 
                    placeholder='Enter your course title' 
                    id='courseTitle' options='emailInput'
                    value={courseTitle} 
                     />
            </div>
            <div>
                <label htmlFor="credit_hours" className='inputLabel'>Course Code</label>
                <Inputs type='text' 
                    placeholder='Enter your course code' 
                    id='credit_hours' options='nameInput'
                    value={credit_hours}
                    onChange={onChange} />
            </div>
            <div>
                <label htmlFor="grade" className='inputLabel'>Course Grade</label>
                <Inputs type='number' 
                    placeholder='Enter your course code' 
                    id='grade' options='nameInput' 
                    value={grade}
                    onChange={onChange} />
            </div>
            
            <div>
                <button type='submit' className='submit'>Add Course</button>
            </div>
        </div>
    </form>
  )
}

export default Form