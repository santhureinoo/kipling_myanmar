import React from "react";
import { NextPageWithLayout } from "../../_app";
import { MultiSelect } from "react-multi-select-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus, faClose } from "@fortawesome/free-solid-svg-icons";

const options = [
    { label: "Grapes 🍇", value: "grapes" },
    { label: "Mango 🥭", value: "mango" },
    { label: "Strawberry 🍓", value: "strawberry", disabled: true },
];

const ExerciseDetail: NextPageWithLayout = () => {

    const [selected, setSelected] = React.useState([]);


    return <React.Fragment>
        <div className="flex w-full md:min-h-screen bg-base-200">
            <div className="w-screen lg:px-64 md:px-32 px-4">
                <div className="grid grid-cols-2 gap-4 my-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Exercise Name</span>
                        </label>
                        <input type="text" placeholder="username" className="input input-bordered" />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">This exercise belongs to</span>
                        </label>
                        <select value={1} className="select select-bordered">
                            <option value={1}>Please choose</option>
                            <option value={2}>telekinesis</option>
                            <option value={3}>time travel</option>
                            <option value={4}>invisibility</option>
                        </select>
                    </div>
                    <div className="form-control col-span-2">
                        <label className="label">
                            <span className="label-text">Content (video)</span>
                        </label>
                        <MultiSelect
                            options={options}
                            value={selected}
                            onChange={setSelected}
                            labelledBy="Select"
                        />
                    </div>

                    {/* <h2>Questions</h2> */}
                    <div className="indicator flex">
                        <div className="indicator-item badge badge-primary cursor-pointer w-8 h-8"><FontAwesomeIcon icon={faClose} /></div>
                        <div className="bg-base-300 place-items-center p-4 md:w-full w-screen">
                            <div className="grid grid-cols-1 gap-2">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Question</span>
                                    </label>
                                    <input type="text" placeholder="username" className="input input-bordered" />
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Type</span>
                                    </label>
                                    <select value={1} className="select select-bordered w-full">
                                        <option value={1}>Please choose</option>
                                        <option value={2}>telekinesis</option>
                                        <option value={3}>time travel</option>
                                        <option value={4}>invisibility</option>
                                    </select>
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Answers</span>
                                    </label>
                                    <div className="flex flex-row gap-x-2">
                                        <div className="flex md:flex-row flex-col">
                                            <input type="text" placeholder="username" className="input input-bordered" />
                                            <label className="cursor-pointer label md:gap-x-8 gap-x-2">
                                                <span className="label-text">Correct?</span>
                                                <input type="checkbox" className="checkbox checkbox-lg" />
                                            </label>
                                        </div>

                                        <div className="btn-group gap-x-4">
                                            <button className="btn btn-active"><FontAwesomeIcon icon={faPlus} /></button>
                                            <button className="btn"><FontAwesomeIcon icon={faMinus} /></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <button className="btn btn-primary">Add More Questions</button>

            </div>
        </div>
    </React.Fragment >
}

export default ExerciseDetail;