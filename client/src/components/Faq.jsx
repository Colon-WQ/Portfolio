import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import { FaDotCircle, FaAngleDown } from 'react-icons/fa';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';


const styles = (theme) => ({
    appBarSpacer: theme.mixins.toolbar,
    root: {
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'start',
        alignItems: 'center'
    },
    sideBar: {
        flex: '20%',
        display: 'flex',
        height: '100%',
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'start',
        alignItems: 'center',
        backgroundColor: theme.palette.contrastPrimary.main
    },
    sideBarRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'start',
        alignItems: 'center',
        width: '100%',
        height: '5%',
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.text.main,
        '&:hover': {
            backgroundColor: theme.palette.secondary.main
        }
    },
    sideRowText: {
        flex: '70%',
        height: '100%',
        width: '100%',
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    sideRowIcon: {
        flex: '30%',
        display: 'grid',
        placeItems: 'center',
        height: '100%',
        width: '100%'
    },
    contentArea: {
        flex: '80%',
        display: 'flex',
        height: '100%',
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'start',
        alignItems: 'center',
        backgroundColor: theme.palette.contrastSecondary.main,
        padding: '2%'
    },
    accordionRoot: {
        width: '100%',
        height: 'auto',
    },
    accordionSummary: {
        backgroundColor: theme.palette.primary.main,
    },
    accordionDetails: {
        backgroundColor: theme.palette.background.default,
    },
    faqAnswerList: {
        margin: 0,
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: '1rem',
        paddingRight: '1rem'
    },
    expansionButtons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'start',
        alignItems: 'center',
        position: 'fixed',
        right: '3%',
        bottom: '3%',
        top: 'auto',
        left: 'auto'
    },
    expandAllButton: {
        borderColor: theme.palette.contrastSecondary.main,
        borderRadius: '5px',
        borderWidth: 'thin',
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.text.main,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: '0.5rem',
        padding: '0.5rem',
        height: 'auto',
        width: 'auto',
        '&:hover': {
            backgroundColor: theme.palette.secondary.main
        }
    }
});

class Faq extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentFAQ: null,
            currentExpansionState: [],
            FAQdata: {
                General: [
                    {
                        question: 'Question 1?',
                        answers: [
                            'Answer 1', 
                            'Answer 2'
                        ]
                    },
                    {
                        question: 'Question 2?',
                        answers: [
                            'Answer 1',
                        ]
                    }
                ],
                User: [
                    {
                        question: 'Question 1?',
                        answers: [
                            'Answer 1',
                        ]
                    }
                ],
                Guest: [
                    {
                        question: 'Question 1?',
                        answers: [
                            'Answer 1',
                        ]
                    }
                ]
            }
        }
        this.setCurrentFAQ = this.setCurrentFAQ.bind(this);
        this.handleExpand = this.handleExpand.bind(this);
    }

    componentDidMount() {
        const temp = this.state.FAQdata['General'].map(faq => false);
        temp[0] = true;
        this.setState({
            currentFAQ: this.state.FAQdata['General'],
            currentExpansionState: temp
        })
    }

    setCurrentFAQ(key) {
        const temp = this.state.FAQdata[key].map(faq => false);
        temp[0] = true;
        this.setState({
            currentFAQ: this.state.FAQdata[key],
            currentExpansionState: temp
        })
    }

    handleExpand(bool) {
        const temp = this.state.currentExpansionState.map(element => bool);
        this.setState({
            currentExpansionState: temp
        })
    }

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <div className={classes.expansionButtons}>
                    <button 
                        className={classes.expandAllButton} 
                        onClick={() => this.handleExpand(true)}
                    >
                        <Typography variant='body2'>Expand All</Typography>
                    </button>
                    <button
                        className={classes.expandAllButton} 
                        onClick={() => this.handleExpand(false)}
                    >
                        <Typography variant='body2'>Unexpand All</Typography>
                    </button>
                </div>
                <div className={classes.sideBar}>
                    {Object.keys(this.state.FAQdata).map(key => {
                        return (
                            <div className={classes.sideBarRow} onClick={() => this.setCurrentFAQ(key)}>
                                <div className={classes.sideRowIcon}>
                                    <FaDotCircle />
                                </div>                                   
                                <div className={classes.sideRowText}>
                                    <Typography variant='body2' component='body2'>{key}</Typography>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <Divider orientation="vertical" flexItem />
                <div className={classes.contentArea}>
                    {
                        this.state.currentFAQ
                        ?
                            this.state.currentFAQ.map((faq, idx) => 
                                <Accordion 
                                    className={classes.accordionRoot}
                                    expanded={this.state.currentExpansionState[idx]}
                                    onChange={(event, expanded) => {
                                        const temp = this.state.currentExpansionState.map(bool => bool);
                                        temp[idx] = expanded;
                                        this.setState({
                                            currentExpansionState: temp
                                        })
                                    }}
                                >
                                    <AccordionSummary
                                        className={classes.accordionSummary}
                                        expandIcon={<FaAngleDown />}
                                        aria-controls="FAQ-question"
                                        id="FAQ-Question"
                                    >
                                        <Typography variant='body2' component='body2'>{faq.question}</Typography>
                                    </AccordionSummary>
                                    <Divider orientation='horizontal'/>
                                    <AccordionDetails
                                        className={classes.accordionDetails}
                                    >
                                        <ul className={classes.faqAnswerList}>
                                            {faq.answers.map(ans => <li><Typography variant='body2' component='body2'>{ans}</Typography></li>)}
                                        </ul>
                                        
                                    </AccordionDetails>
                                </Accordion>
                            )
                        : 
                            <div/>
                    }
                </div>

            </div>
        )
    }
}

export default withStyles(styles)(Faq);