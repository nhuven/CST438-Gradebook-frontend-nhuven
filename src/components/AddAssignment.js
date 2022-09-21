import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import {DataGrid} from '@mui/x-data-grid';
import {SERVER_URL} from '../constants.js'

import PropTypes from 'prop-types'; 
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';

// NOTE:  for OAuth security, http request must have
//   credentials: 'include' 
//

class AddAssignment extends React.Component {
    constructor(props) {
      super(props);
      this.state = {courses: [], assignmentName:"", dueDate:"", assignmentID:""};
    };
 
   componentDidMount() {
    this.fetchCourses("instructor");
	console.log(this.state);
  }
  
   fetchCourses = (instructorEmail)=> {
    console.log("Assignment.fetchCourses");
    const token = Cookies.get('XSRF-TOKEN');
    //if (instructorEmail) {  // need a valid instructorEmail to fetch thier courses
      fetch(`${SERVER_URL}/instructor/${instructorEmail}/courses`, 
      {  
        method: 'GET', 
        headers: { 'X-XSRF-TOKEN': token }
      } )
        .then(response => response.json() )
        .then(responseData => {
            this.setState({ 
              courses: responseData.courses.map((course, id) => ( { id: id, ...course } )) }); 
        })
        .catch(err => console.error(err));
    //} else {
      //this.setState( { courses: [] });
    //}
  }
 
  submitAssignment = (assignmentName, dueDate, courseID) => {
    // verify attempt is valid integer
    /*if ( ! (/^[0-9]+$/.test(attempt) ) ) {  
        this.setState({message: 'Enter valid integer.'});
        return;
    }*/
    fetch('http://localhost:8081/assignment',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assignmentName: this.state.assignmentName,
          dueDate: this.state.dueDate,
          courseId: this.state.courseId })
      })
      .then(res => {
        if (res.ok) {
          toast.success("Course successfully added", {
              position: toast.POSITION.BOTTOM_LEFT
          });
          this.fetchCourses();
        } else {
          toast.error("Error when adding", {
              position: toast.POSITION.BOTTOM_LEFT
          });
          console.error('Post http status =' + res.status);
        }})
    .catch(err => {
      toast.error("Error when adding", {
            position: toast.POSITION.BOTTOM_LEFT
        });
        console.error(err);
    })
  } 
  
  handleChange = (event) =>  {
    this.setState({[event.target.name]: event.target.value});
  }
  
   onRadioClick = (event) => {
    console.log("Assignment.onRadioClick " + event.target.value);
    this.setState({courseId: event.target.value});
  }
  
  render() {
     const columns = [
      {
        field: 'name',
        headerName: 'Course',
        width: 400,
        renderCell: (params) => (
          <div>
          <Radio
            checked={params.row.id == this.state.courseId}
            onChange={this.onRadioClick}
            value={params.row.id}
            color="default"
            size="small"
          />
          {params.value}
          </div>
        )
	   }
      ];
      
      const assignmentSelected = this.state.courses[this.state.selected];
      return (
          <div align="left" >
            <h4>Add Assignment </h4>

			<br/>
			<TextField autoFocus style = {{width:200}} label="Assignment Name" name="assignmentName" 
				 onChange={this.handleChange} value={this.state.assignmentName} /> 
			<br/>
			<br/>
			<TextField style = {{width:200}} label="Due Date" name="dueDate" 
				 onChange={this.handleChange} value={this.state.dueDate} /> 
			<br/>
			<br/>
			<div style={{ height: 450, width: '100%', align:"left"   }}>
                <DataGrid rows={this.state.courses} columns={columns} />
             </div>
			<br/>
			<br/>
			<Button component={Link} to={{pathname:'/'}}
			variant="outlined" color="primary" style={{margin: 10}}
				  onClick={this.submitAssignment} >Add</Button>         
          
            <Button component={Link} to={{pathname:'/'}} 
                    variant="outlined" color="primary" disabled={this.state.courses.length===0}  style={{margin: 10}}>
              Cancel
            </Button>

            <ToastContainer autoClose={1500} /> 
          </div>
      )
  }
}  

  AddAssignment.propTypes = {

  };
export default AddAssignment;