/* TODO - DELETE BEFORE DEPLOYMENT */
export const SampleOrders = [
    {
        id: 1,
        learner: 3,
        expert: 3,
        deadline: "5/30/2024",
        price: 67.52,
        assignment: 3,
        status: "active",
        payment: "complete",
        instructions: "non velit donec diam neque vestibulum eget vulputate ut ultrices vel augue vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae donec pharetra magna vestibulum aliquet ultrices erat tortor sollicitudin mi",
        date_created: "7/4/2024",
        date_modified: "3/5/2024"
    },

    {
        id: 2,
        learner: 3,
        expert: 8,
        deadline: "12/7/2023",
        price: 24.72,
        assignment: 15,
        status: "active",
        payment: "complete",
        instructions: "blandit mi in porttitor pede justo eu massa donec dapibus duis at velit eu est congue elementum in hac habitasse platea dictumst morbi vestibulum velit id pretium iaculis diam erat fermentum justo nec condimentum neque sapien placerat ante nulla justo aliquam quis turpis eget elit sodales scelerisque",
        date_created: "11/6/2023",
        date_modified: "3/12/2024"
    },

    {
        id: 3,
        learner: 4,
        expert: 5,
        deadline: "12/9/2023",
        price: 28.76,
        assignment: 27,
        status: "active",
        payment: "complete",
        instructions: "felis sed interdum venenatis turpis enim blandit mi in porttitor pede justo eu massa donec dapibus duis at velit eu est congue elementum",
        date_created: "3/23/2024",
        date_modified: "9/30/2023"
    },

    {
        id: 4,
        learner: 7,
        expert: 1,
        deadline: "9/22/2023",
        price: 27.45,
        assignment: 44,
        status: "active",
        payment: "complete",
        instructions: "sed sagittis nam congue risus semper porta volutpat quam pede lobortis ligula sit amet eleifend pede libero quis orci nullam molestie nibh in lectus pellentesque at nulla suspendisse potenti cras in",
        date_created: "3/8/2024",
        date_modified: "2/22/2024"
    },

    {
        id: 5,
        learner: 3,
        expert: 3,
        deadline: "2/28/2024",
        price: 48.16,
        assignment: 3,
        status: "active",
        payment: "Pending",
        instructions: "quis libero nullam sit amet turpis elementum ligula vehicula consequat morbi a ipsum integer a nibh in quis justo maecenas rhoncus aliquam lacus morbi quis tortor id nulla ultrices aliquet",
        date_created: "12/8/2023",
        date_modified: "3/29/2024"
    },

    {
        id: 6,
        learner: 10,
        expert: 7,
        deadline: "11/10/2023",
        price: 40.23,
        assignment: 15,
        status: "active",
        payment: "complete",
        instructions: "nisl ut volutpat sapien arcu sed augue aliquam erat volutpat in congue etiam justo etiam pretium iaculis justo in hac habitasse platea dictumst etiam faucibus cursus urna ut tellus nulla ut erat id mauris vulputate elementum nullam varius nulla facilisi cras",
        date_created: "11/19/2023",
        date_modified: "6/29/2024"
    },

    {
        id: 7,
        learner: 6,
        expert: 2,
        deadline: "11/11/2023",
        price: 23.87,
        assignment: 22,
        status: "pending",
        payment: "processing",
        instructions: "rhoncus dui vel sem sed sagittis nam congue risus semper porta volutpat quam pede lobortis ligula sit amet eleifend pede",
        date_created: "9/17/2023",
        date_modified: "5/20/2024"
    },

    {
        id: 8,
        learner: 7,
        expert: 9,
        deadline: "6/24/2024",
        price: 71.65,
        assignment: 13,
        status: "active",
        payment: "pending",
        instructions: "ultrices phasellus id sapien in sapien iaculis congue vivamus metus arcu adipiscing molestie hendrerit at vulputate vitae nisl aenean lectus pellentesque eget nunc donec quis orci eget orci vehicula condimentum",
        date_created: "5/31/2024",
        date_modified: "5/4/2024"
    },

    {
        id: 9,
        learner: 6,
        expert: 9,
        deadline: "2/18/2024",
        price: 26.68,
        assignment: 60,
        status: "complete",
        payment: "complete",
        instructions: "blandit ultrices enim lorem ipsum dolor sit amet consectetuer adipiscing elit proin interdum mauris non ligula pellentesque ultrices phasellus id sapien in",
        date_created: "5/17/2024",
        date_modified: "8/5/2023"
    },

    {
        id: 10,
        learner: 3,
        expert: 2,
        deadline: "8/6/2023",
        price: 58.43,
        assignment: 19,
        status: "active",
        payment: "complete",
        instructions: "nec nisi vulputate nonummy maecenas tincidunt lacus at velit vivamus vel nulla eget eros elementum pellentesque quisque porta volutpat erat quisque erat eros viverra eget congue eget semper rutrum nulla nunc purus phasellus in felis donec semper sapien a libero nam dui proin leo odio porttitor id consequat in",
        date_created: "11/17/2023",
        date_modified: "5/20/2024"
    }]

export const FindOrderComments = async (order_id) => {
    return SampleOrderComments.filter((order) => order.id === order_id)
}

export const SampleOrderComments =
[
    {
        "id": 16,
        "comment": "Please submit deposit for work to start.",
        "created_at": "2024-08-01T11:11:27.888385Z",
        "updated_at": "2024-08-01T11:11:27.888385Z",
        "user": 1,
        "order": 1
    },
    {
        "id": 16,
        "comment": "Elaborate on what aspects of Covid-19 the essay should be on.",
        "created_at": "2024-08-01T11:18:14.652647Z",
        "updated_at": "2024-08-01T11:18:14.652647Z",
        "user": 4,
        "order": 2
    },
    {
        "id": 16,
        "comment": "The cause, effect and spread",
        "created_at": "2024-08-01T11:18:36.454539Z",
        "updated_at": "2024-08-01T11:18:36.454539Z",
        "user": 4,
        "order": 2
    },
    {
        "id": 16,
        "comment": "Thank you for elaborating",
        "created_at": "2024-08-01T11:18:48.745477Z",
        "updated_at": "2024-08-01T11:18:48.745477Z",
        "user": 4,
        "order": 2
    },
    {
        "id": 16,
        "comment": "Please clarify the style to be used",
        "created_at": "2024-08-01T11:19:12.721484Z",
        "updated_at": "2024-08-01T11:19:12.721484Z",
        "user": 4,
        "order": 3
    },
    {
        "id": 16,
        "comment": "APA",
        "created_at": "2024-08-01T11:19:28.127066Z",
        "updated_at": "2024-08-01T11:19:28.127066Z",
        "user": 4,
        "order": 3
    },
    {
        "id": 7,
        "comment": "Great. Is a cover letter required?",
        "created_at": "2024-08-01T11:20:07.480851Z",
        "updated_at": "2024-08-01T11:20:07.480851Z",
        "user": 4,
        "order": 4
    },
    {
        "id": 8,
        "comment": "Great. Will deliver in the next few days.",
        "created_at": "2024-08-01T11:20:29.988402Z",
        "updated_at": "2024-08-01T11:20:29.988402Z",
        "user": 4,
        "order": 4
    }
]