/* tslint:disable */


/**
 * AUTO-GENERATED FILE @ 2023-01-07 14:09:08 - DO NOT EDIT!
 *
 * This file was automatically generated by schemats v.3.0.3
 * $ schemats generate -c mysql://username:password@localhost/kipling_db -t answers -t courses -t exercises -t exercises_files -t files -t groups -t groups_courses -t groups_users -t questions -t users -t users_courses -s kipling_db
 *
 */


export namespace answersFields {
    export type id = string;
    export type question_id = string;
    export type answer = string;
    export type type = number;
    export type valid = number;
    export type explanation = string | null;
    export type created_at = string;
    export type updated_at = string;


}

export interface answers {
    [key: string]: any;
    id?: answersFields.id;
    question_id?: answersFields.question_id;
    answer: answersFields.answer;
    type: answersFields.type;
    valid: answersFields.valid;
    explanation: answersFields.explanation;
    created_at?: answersFields.created_at;
    updated_at?: answersFields.updated_at;

}

export namespace coursesFields {
    export type id = number;
    export type photo = string | null;
    export type name = string;
    export type description = string | null;
    export type status = number;
    export type trailer_id = number | null;
    export type created_at = string;
    export type updated_at = string;


}

export interface courses {
    [key: string]: any;
    id?: coursesFields.id;
    photo: coursesFields.photo;
    name: coursesFields.name;
    description: coursesFields.description;
    status: coursesFields.status;
    trailer_id: coursesFields.trailer_id;
    created_at?: coursesFields.created_at;
    updated_at?: coursesFields.updated_at;

    //Custom 
    exercise_counts?: number;
    exercise_names?: string;
    exercise_ids?: string;

    //Custom
    questions?: questions[];
}

export namespace exercisesFields {
    export type id = number | undefined;
    export type name = string;
    export type courses_id = string;
    export type status = number;
    export type created_at = string;
    export type updated_at = string;

}

export interface exercises {
    [key: string]: any;
    id?: exercisesFields.id;
    name: exercisesFields.name;
    courses_id?: exercisesFields.courses_id;
    status: exercisesFields.status;
    created_at?: exercisesFields.created_at;
    updated_at?: exercisesFields.updated_at;

    //Custom
    questions?: questions[];
    files?: multiple_select[];
    actualFiles?: files[];
}

export namespace exercises_filesFields {
    export type exercises_id = number;
    export type files_id = number;
    export type created_at = string;
    export type updated_at = string;


}

export interface exercises_files {
    exercises_id: exercises_filesFields.exercises_id;
    files_id: exercises_filesFields.files_id;
    created_at?: exercises_filesFields.created_at;
    updated_at?: exercises_filesFields.updated_at;

}

export namespace filesFields {
    export type id = number;
    export type name = string;
    export type unique_name = string;
    export type status = number;
    export type created_at = string;
    export type updated_at = string;

}

export interface files {
    [key: string]: any;
    id?: filesFields.id;
    name: filesFields.name;
    unique_name: filesFields.unique_name;
    status: filesFields.status;
    created_at?: filesFields.created_at;
    updated_at?: filesFields.updated_at;
}

export namespace groupsFields {
    export type id = number;
    export type name = string;
    export type status = number;
    export type created_at = string;
    export type updated_at = string;

}

export interface groups {
    [key: string]: any;
    id?: groupsFields.id;
    name: groupsFields.name;
    status: groupsFields.status;


    // Custom 
    course_ids: multiple_select[];
    user_ids: multiple_select[];

    user_ids_string?: string;
    course_ids_string?: string;

    created_at?: groupsFields.created_at;
    updated_at?: groupsFields.updated_at;
}
export namespace groups_coursesFields {
    export type groupId = number;
    export type courseId = number;
    export type status = number;
    export type created_at = string;
    export type updated_at = string;

}

export interface groups_courses {
    groupId: groups_coursesFields.groupId;
    courseId: groups_coursesFields.courseId;
    status: groups_coursesFields.status;
    created_at?: groups_coursesFields.created_at;
    updated_at?: groups_coursesFields.updated_at;

}

export namespace groups_usersFields {
    export type groupId = number;
    export type userId = string;
    export type status = number;
    export type created_at = string;
    export type updated_at = string;

}

export interface groups_users {
    groupId: groups_usersFields.groupId;
    userId: groups_usersFields.userId;
    status: groups_usersFields.status;
    created_at?: groups_usersFields.created_at;
    updated_at?: groups_usersFields.updated_at;
}

export namespace questionsFields {
    export type id = string | undefined;
    export type question = string;
    export type type = number;
    export type exercise_id = number | undefined;
    export type created_at = string;
    export type updated_at = string;

}

export interface questions {
    [key: string]: any;
    id?: questionsFields.id;
    question: questionsFields.question;
    type: questionsFields.type;
    exercise_id: questionsFields.exercise_id;
    created_at?: questionsFields.created_at;
    updated_at?: questionsFields.updated_at;
    answers?: answers[];
}

export namespace usersFields {
    export type id = string;
    export type name = string;
    export type password = string;
    export type status = number;
    export type phoneNumber = string;
    export type role = number;
    export type isNew = number;
    export type created_at = string;
    export type updated_at = string;

}

export interface users {
    [key: string]: any;
    id: usersFields.id;
    name: usersFields.name;
    password: usersFields.password;
    phoneNumber?: usersFields.phoneNumber;
    role: number;
    status: usersFields.status;
    isNew?: usersFields.isNew;
    course_ids?: string;
    course_names?: string;
    created_at?: usersFields.created_at;
    updated_at?: usersFields.updated_at;
}

export interface bulkUsers {
    usernames: string;
    groupIds: multiple_select[];
    
}

export namespace users_coursesFields {
    export type users_id = number;
    export type courses_id = number;
    export type status = number;
    export type created_at = string;
    export type updated_at = string;


}

export interface users_courses {
    users_id: users_coursesFields.users_id;
    courses_id: users_coursesFields.courses_id;
    status: users_coursesFields.status;
    created_at?: users_coursesFields.created_at;
    updated_at?: users_coursesFields.updated_at;
}


export interface multiple_select {
    label: string;
    value: any;
}

export interface login_credential {
    id?: string;
    name: string;
    password: string;
    phoneNumber: string;
    confirm?: string;
}