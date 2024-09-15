import Table from "react-bootstrap/Table";
import React from "react";
import {titleCase} from "../../components/text";
import {CustomModal} from "../../components/modal";
import {HorizontalRule} from "../../components/elements";
import Form from "react-bootstrap/Form";
import {generateRandomPassword, generateRandomUsername} from "../../components/auth";
import {Button} from "react-bootstrap";

export const UsersTable = (props) => {
    const allUsers = props.data
    return (
        <div className="w-90 mx-auto">
            <Table striped hover>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Username</th>
                    <th>Active</th>
                    <th>Role</th>
                    <th>Last Login</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {
                    allUsers.map((user) => (
                        <tr>
                            <td className="fw-semibold">{user.id}</td>
                            <td className="small">{user.username}</td>
                            <td className="small">{titleCase(user.is_active.toString())}</td>
                            <td className="small">{titleCase(user.role)}</td>
                            <td className="small">{user.last_login}</td>
                            <td></td>
                        </tr>
                    ))
                }
                </tbody>
            </Table>
        </div>
    )
}

export const NewUserBtn = (props) => {
    const modalData = {
        link_title: 'New User',
        modal_body: (
            <div className="mb-5 d-flex flex-column justify-content-evenly align-items-center">
                <div className="mb-3">
                    <p className="display-5 text-center">New User</p>
                    <HorizontalRule ruleStyles="w-100 border-2 text-purple" />
                </div>
                <div className="w-90">
                    <NewUserForm/>
                </div>
            </div>
            ),
    }
    return (
        <div className="">
            <div className="w-100">
                <CustomModal data={modalData}/>
            </div>

        </div>
    )
}

export const DeleteUserBtn = () => {
    const modalData = {
        link_title: 'Delete',
        modal_body: (<ConfirmDeleteUser/>)
    }
    return (
        <div className=""></div>
    )
}

export const ConfirmDeleteUser = (props) => {
    return (
        <div className="">
            <Form>
                <Form.Group>
                    <p>Are you sure you want to delete user {props.username}?</p>
                    <Form.Check type="checkbox" className="p"/>
                </Form.Group>
            </Form>
        </div>
    )
}

export const NewUserForm = () => {
    return (
        <Form className="w-100 d-flex flex-column justify-content-evenly align-items-center">
            <Form.Group className="mb-2 w-100">
                <Form.Label className="text-black-50 ms-1 small">Username</Form.Label>
                <Form.Control as="input" type="text" placeholder="Username" value={generateRandomUsername()} required/>
            </Form.Group>
            <Form.Group className="w-100 mb-2">
                <Form.Label className="text-black-50 ms-1 small">Email</Form.Label>
                <Form.Control as="input" type="email" placeholder="address@mail.com"/>
            </Form.Group>
            <Form.Group className="w-100 mb-2">
                <Form.Label className="text-black-50 ms-1 small">Password</Form.Label>
                <Form.Control as="input" type="password" placeholder="MyPassWord" value={generateRandomPassword()} disabled/>
                <Form.Text>Random generated password will be sent to user's email.</Form.Text>
            </Form.Group>
            <Form.Group className="w-90 mx-auto mt-4">
                <Button className="btn site-btn w-100 p-2" type="submit">Save</Button>
            </Form.Group>


        </Form>
    )
}

