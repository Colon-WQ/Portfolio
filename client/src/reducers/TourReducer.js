
import { 
    START,
    RESTART,
    STOP,
    NEXT_OR_PREV,
    NEXT
 } from '../actions/TourAction';

const STEPS = [
    {
        title: 'Step 1: Create a portfolio',
        target: '#add-portfolio-button',
        content: 'Click this button to open a create portfolio dialog. Then, input a unique, non-empty name for your portfolio and click on "Set Name" button to finalize.',
        styles: {
            buttonNext: {
              display: 'none',
            }
        }
    },
    {
        title: 'Step 2: Add a template',
        target: '#add-template-button',
        content: 'Click this button to open a template selection dialog. Choose a template from the dialog and click on it to add it to your portfolio.',
        styles: {
            buttonNext: {
              display: 'none',
            }
        }
    },
    {
        title: 'Step 3: Edit the template',
        target: '#preview',
        content: 'Hover your mouse over the top left of the template to reveal a "Settings" button. Click on it and begin editing away.',
        styles: {
            buttonNext: {
              display: 'none',
            }
        },
        placement: 'bottom'
    },
    {
        title: 'Step 4: Save the portfolio',
        target: '#save-portfolio-button',
        content: 'Click this button to save your portfolio to our database. You will be able to edit it again later.',
        styles: {
            buttonNext: {
              display: 'none',
            }
        }
    },
    {
        title: 'Step 5: Publish the portfolio',
        target: '#publish-portfolio-button',
        content: `If you are a user, this will open a dialog for building your portfolio website.\n
                If you are a guest, this will download your portfolio files as a zip.`
    }
];

export const STEPS_COUNT = STEPS.length;

const initialState = {
    key: new Date(),
    run: false,
    continuous: true,
    loading: false,
    stepIndex: 0,
    steps: STEPS,
    hideBackButton: true,
    disableOverlayClose: true,
    spotlightClicks: true,
    styles: {
        options: {
            zIndex: 1250
        }
    }
}

export default function tour(state = initialState, action) {
    switch(action.type) {
        case START:
            return {
                ...state,
                stepIndex: 0,
                run: true,
                loading: false,
                key: new Date()
            };
        case STOP:
            return {
                ...state,
                stepIndex: 0,
                run: false
            };
        case NEXT_OR_PREV:
            return {
                ...state,
                ...action.payload
            };
        case NEXT:
            return {
                ...state,
                stepIndex: action.payload.step
            }
        default:
            return state;
    }
}