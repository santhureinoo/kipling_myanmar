import { v4 as uuidv4 } from 'uuid';
import { answers, courses, exercises, files, multiple_select, questions, users } from './type';

function pad(num: number) {
    let numStr = num.toString();
    while (numStr.length < 2) numStr = "0" + num;
    return numStr;
}

export const initialUser = (id: number) => {
    return {
        id: `KPU-${pad(id)}`,
        name: '',
        password: '',
        status: 0,
        course_names: '',
        course_ids: '',
    } as users
}

export const initialExercise = () => {
    return {
        name: '',
        courses_id: '',
        questions: [] as questions[],
        files: [] as multiple_select[],
    } as exercises
}

export const initialQuestion = (id: number) => {
    return {
        id: `Q-${pad(id)}`,
        question: '',
        type: 0,
        exercise_id: undefined,
        answers: [
            initialAnswer(0, 0)
        ]
    }
}

export const initialAnswer = (id: number, questionId: number) => {
    return {
        id: `A-${pad(id)}`,
        type: 0,
        question_id: questionId,
        answer: '',
        valid: 0,
        explanation: '',
    }
}

export const initialCourse = () => {
    return {
        // photo: '',
        name: '',
        description: '',
        trailer_id: 0,
    } as courses
}

export const initialLogin = () =>{ 
    return {
        name: '',
        password: '',
        phoneNumber: '',
    }
}