import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import List from '@material-ui/core/List';
import TextField from '@material-ui/core/TextField';
import ListItem from '@material-ui/core/ListItem';
import { createMuiTheme  } from '@material-ui/core/styles';
import { uncommonIngrList } from './utils/graph_dict'      /*uncomment when the uncommonIngerList is ready*/
import { Typography } from '@material-ui/core';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';

const styles = {
    root: {
        display:"flex",
        justifyContent:"flex-start",
        marginTop:50,
        marginLeft:50

    },
    list:{
        width: '100%',
        maxWidth: 250,
        border:"1px solid black"
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
      },
      chip: {
        margin: 2,
      },
      constraint:{
        display:"flex",
        flexDirection:"column",
        marginLeft:15,
        marginRight:10,
        padding:5,
        border:"1px solid black"
      },
      timeConstraintContainer:{
          display:"flex",
          flexDirection:"row"
      },
      timeConstraintItem:{
          margin:5
    },
    timeContainerTitle:{
        padding:5
    },
    ingredientConstraintContainer:{
        display:"flex",
        flexDirection:"row"
    },
    parentContainer:{
        display:"flex",
        flexDirection:"column",
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
      },
      chip: {
        margin: 2,
      },
      formControl: {
        margin: 8,
        minWidth: 120,
        maxWidth: 300,
      },
  };


  const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
    'Oliver Hansen',
    'Van Henry',
    'April Tucker',
    'Ralph Hubbard',
    'Omar Alexander',
    'Carlos Abbott',
    'Miriam Wagner',
    'Bradley Wilkerson',
    'Virginia Andrews',
    'Kelly Snyder',
  ];

class TogglesPanel extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            showConstraints:true,
            showLeastCommon:false,
            showTimeConstraint:false,
            showIngredientsConstraint:false,
            showToolConstraint:false,
            timeMinHour:null,
            timeMinMinute:null,
            timeMaxHour:null,
            timeMaxMinute:null,
            leastCommonIngredients:[],
            selectedLeastCommon:[],

            unUsedIngredients:["a","b","c","d"],
            selectedUnusedIngredients:[],

            ingredientsToAppear:["e","f","g"],
            selectedIngredientsToAppear:[],

            unUsedTools:["h","i","j"],
            selectedUnusedTools:[],

            preferedTools:["k","l","m"],
            selectedPreferedTools:[]
        }
        this.findNodesByIngredients = props.findNodesByIngredients.bind(this);
    }

/*uncomment below function when the uncommonIngerList is ready*/
componentDidMount(){                                                      
    const leastCommonList = uncommonIngrList.slice(0, 10) //.map(obj=>obj.ingr_name);
    this.setState({
        leastCommonIngredients:leastCommonList
    })
}

handleChangeSwitchChange = switchName => event => {
    event.persist();
    this.setState((prev) => {
        return {
            ...prev,
            selectedLeastCommon: !(event.target && event.target.checked) ? [] : [...prev.selectedLeastCommon],
            [switchName]: event.target && event.target.checked
        };
    })
};

handleTimeChange = fieldName => event =>{
    this.setState({
        [fieldName]:+Math.floor(event.target.value)
    })
}

handleLeastCommonIngredientChange = (value,arrayName) => () => {
    const currentIndex = this.state[arrayName].indexOf(value);
    const newChecked = [...this.state[arrayName]];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    this.setState({
        [arrayName]:newChecked
    })
};

handleArrayChange = (arrayName) =>(event) => {
    this.setState({
        [arrayName]:event.target.value
    })
  };

componentDidUpdate(prevProps, prevState){
    if(JSON.stringify(prevState.selectedLeastCommon) !== JSON.stringify(this.state.selectedLeastCommon)){//need to update 
        this.findNodesByIngredients(this.state.selectedLeastCommon);
    }
    const prevConstraints = {
        timeMinHour:prevState.timeMinHour,
        timeMinMinute:prevState.timeMinMinute,
        timeMaxHour:prevState.timeMaxHour,
        timeMaxMinute:prevState.timeMaxMinute,
        selectedUnusedIngredients:prevState.selectedUnusedIngredients,
        selectedIngredientsToAppear:prevState.selectedIngredientsToAppear,
        selectedUnusedTools:prevState.selectedUnusedTools,
        selectedPreferedTools:prevState.selectedPreferedTools


    }
    const currentConstraints = {
        timeMinHour:this.state.timeMinHour,
        timeMinMinute:this.state.timeMinMinute,
        timeMaxHour:this.state.timeMaxHour,
        timeMaxMinute:this.state.timeMaxMinute,
        selectedUnusedIngredients:this.state.selectedUnusedIngredients,
        selectedIngredientsToAppear:this.state.selectedIngredientsToAppear,
        selectedUnusedTools:this.state.selectedUnusedTools,
        selectedPreferedTools:this.state.selectedPreferedTools
    }
    if(JSON.stringify(prevConstraints) !== JSON.stringify(currentConstraints)){
        //add some function/logic when there's a change in constraints
    }
}




    render(){
        const { classes } = this.props;
        return(
            <div>
                <FormControl component="fieldset" className={classes.root}>
                    <FormGroup>
                    
                        <FormControlLabel
                            control={
                            <Switch checked={this.state.showLeastCommon} size="medium"  onChange={this.handleChangeSwitchChange('showLeastCommon')}/>}
                            label="Show least common ingredients"
                        />
                        {this.state.showLeastCommon && <List className={classes.list}>
                            {this.state.leastCommonIngredients.map(ingredient=>{
                                return(
                                    <ListItem key={ingredient} style={{backgroundColor: this.state.selectedLeastCommon.indexOf(ingredient) !== -1 ? "orange" : ""}}  dense button onClick={this.handleLeastCommonIngredientChange(ingredient,"selectedLeastCommon")}>
                                        <ListItemText id={ingredient} primary={ingredient} />
                                    </ListItem>
                                )
                            })}
                        </List> 
                        }
                        <FormControlLabel
                            control={
                            <Switch checked={this.state.showConstraints} size="medium" onChange={this.handleChangeSwitchChange('showConstraints')}/>}
                            label="Add Constraints"
                        />
                    </FormGroup>
                </FormControl>
                {this.state.showConstraints && <div className={classes.constraint}>
                        <div className={classes.timeConstraintContainer}>
                        <FormControlLabel
                            value="top"
                            control={<Switch checked={this.state.showTimeConstraint} size="medium"  onChange={this.handleChangeSwitchChange('showTimeConstraint')}/>}
                            label="Add Time Constraint"
                            labelPlacement="top"
                            />
                            {this.state.showTimeConstraint && <div style={{display:"flex", flexDirection:"row"}}>
                           <div className={classes.timeConstraintContainer}>
                                <Typography variant="body2" style={{padding:15}}>Min Time:</Typography>
                                <div className={classes.timeConstraintItem}>
                                    <TextField
                                    label="Hours"
                                    type="number"
                                    style = {{width: 75}}
                                    onChange={this.handleTimeChange("timeMinHour")}
                                    value={this.state.timeMinHour}
                                   
                                    />
                                </div>
                                <div className={classes.timeConstraintItem}>
                                    <TextField
                                    label="Minutes"
                                    type="number"
                                    style = {{width: 75}}
                                    onChange={this.handleTimeChange("timeMinMinute")}
                                    value={this.state.timeMinMinute}

                                    />
                                </div>
                            </div>
                            <div className={classes.timeConstraintContainer}>
                                <Typography variant="body2" style={{padding:15}}>Max Time:</Typography>
                                <div className={classes.timeConstraintItem}>
                                    <TextField
                                    label="Hours"
                                    type="number"
                                    style = {{width: 75}}
                                    onChange={this.handleTimeChange("timeMaxHour")}
                                    value={this.state.timeMaxHour}
                                    />
                                </div>
                                <div className={classes.timeConstraintItem}>
                                    <TextField
                                    label="Minutes"
                                    type="number"
                                    style = {{width: 75}}
                                    onChange={this.handleTimeChange("timeMaxMinute")}
                                    value={this.state.timeMaxMinute}
                                    />
                                </div>
                            
                               
                            </div>
                            </div>}

                            


                        </div>
                        <div className={classes.timeConstraintContainer}>
                            <FormControlLabel
                            value="top"
                            control={<Switch checked={this.state.showIngredientsConstraint} size="medium"  onChange={this.handleChangeSwitchChange('showIngredientsConstraint')}/>}
                            label="Add Ingredients Constraint"
                            labelPlacement="top"
                            style={{width:127, justifyContent:"center"}}
                            />
                            {this.state.showIngredientsConstraint && <div style={{display:"flex", flexDirection:"row"}}>
                            <div className={classes.ingredientConstraintContainer}>
                            <FormControl className={classes.formControl}>
                                <InputLabel >Do Not Use These Ingredients</InputLabel>
                                <Select
                                multiple
                                value={this.state.selectedUnusedIngredients}
                                onChange={this.handleArrayChange("selectedUnusedIngredients")}
                                input={<Input />}
                                style={{paddingTop:30}}
                                renderValue={selected => (
                                    <div className={classes.chips}>
                                      {selected.map(value => (
                                        <Chip key={value} label={value} className={classes.chip} onDelete={()=>{
                                            this.setState({
                                                selectedUnusedIngredients:[...this.state.selectedUnusedIngredients].filter(item=>item!==value)
                                            })
                                        }} />
                                      ))}
                                    </div>
                                  )}
                                MenuProps={MenuProps}
                                >
                                {this.state.unUsedIngredients.map(ingredient => (
                                    <MenuItem key={ingredient} value={ingredient}>
                                    <Checkbox checked={this.state.selectedUnusedIngredients.includes(ingredient)} />
                                    <ListItemText primary={ingredient} />
                                    </MenuItem>
                                ))}
                                </Select>
                            </FormControl>

                                </div>
                                <div className={classes.ingredientConstraintContainer}>
                                <div className={classes.ingredientConstraintContainer}>
                            <FormControl className={classes.formControl}>
                                <InputLabel >Want These Ingredients To Appear</InputLabel>
                                <Select
                                multiple
                                value={this.state.selectedIngredientsToAppear}
                                onChange={this.handleArrayChange("selectedIngredientsToAppear")}
                                input={<Input />}
                                style={{paddingTop:30}}
                                renderValue={selected => (
                                    <div className={classes.chips}>
                                      {selected.map(value => (
                                        <Chip key={value} label={value} className={classes.chip} onDelete={()=>{
                                            this.setState({
                                                selectedIngredientsToAppear:[...this.state.selectedIngredientsToAppear].filter(item=>item!==value)
                                            })
                                        }} />
                                      ))}
                                    </div>
                                  )}
                                MenuProps={MenuProps}
                                >
                                {this.state.ingredientsToAppear.map(ingredient => (
                                    <MenuItem key={ingredient} value={ingredient}>
                                    <Checkbox checked={this.state.selectedIngredientsToAppear.includes(ingredient)} />
                                    <ListItemText primary={ingredient} />
                                    </MenuItem>
                                ))}
                                </Select>
                            </FormControl>

                                </div>
                                </div>
                            </div>}
                                
                        </div>

                        <div className={classes.timeConstraintContainer}>
                            <FormControlLabel
                            value="top"
                            control={<Switch checked={this.state.showToolConstraint} size="medium"  onChange={this.handleChangeSwitchChange('showToolConstraint')}/>}
                            label="Add Tool Constraint"
                            labelPlacement="top"
                            style={{width:127, justifyContent:"center"}}
                            />
                            {this.state.showToolConstraint && <div style={{display:"flex", flexDirection:"row"}}>
                            <div className={classes.ingredientConstraintContainer}>
                            <FormControl className={classes.formControl}>
                                <InputLabel >Can't Use</InputLabel>
                                <Select
                                multiple
                                value={this.state.selectedUnusedTools}
                                onChange={this.handleArrayChange("selectedUnusedTools")}
                                input={<Input />}
                                style={{paddingTop:30}}
                                renderValue={selected => (
                                    <div className={classes.chips}>
                                      {selected.map(tool => (
                                        <Chip key={tool} label={tool} className={classes.chip} onDelete={()=>{
                                            this.setState({
                                                selectedUnusedTools:[...this.state.selectedUnusedTools].filter(item=>item!==tool)
                                            })
                                        }} />
                                      ))}
                                    </div>
                                  )}
                                MenuProps={MenuProps}
                                >
                                {this.state.unUsedTools.map(tool => (
                                    <MenuItem key={tool} value={tool}>
                                    <Checkbox checked={this.state.selectedUnusedTools.includes(tool)} />
                                    <ListItemText primary={tool} />
                                    </MenuItem>
                                ))}
                                </Select>
                            </FormControl>

                                </div>
                                <div className={classes.ingredientConstraintContainer}>
                                <div className={classes.ingredientConstraintContainer}>
                            <FormControl className={classes.formControl}>
                                <InputLabel >Prefer To Use</InputLabel>
                                <Select
                                multiple
                                value={this.state.selectedPreferedTools}
                                onChange={this.handleArrayChange("selectedPreferedTools")}
                                input={<Input />}
                                style={{paddingTop:30}}
                                renderValue={selected => (
                                    <div className={classes.chips}>
                                      {selected.map(tool => (
                                        <Chip key={tool} label={tool} className={classes.chip} onDelete={()=>{
                                            this.setState({
                                                selectedPreferedTools:[...this.state.selectedPreferedTools].filter(item=>item!==tool)
                                            })
                                        }} />
                                      ))}
                                    </div>
                                  )}
                                MenuProps={MenuProps}
                                >
                                {this.state.preferedTools.map(tool => (
                                    <MenuItem key={tool} value={tool}>
                                    <Checkbox checked={this.state.selectedPreferedTools.includes(tool)} />
                                    <ListItemText primary={tool} />
                                    </MenuItem>
                                ))}
                                </Select>
                            </FormControl>

                                </div>
                                </div>
                            </div>}
                                
                        </div>

                        
                </div>}
            </div>
        )
    }
}


export default withStyles(styles)(TogglesPanel);
