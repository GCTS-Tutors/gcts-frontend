import {Pagination} from "react-bootstrap";


export const CustomPagination = () => {
    let active = 2;
    let items = []
    for (let number = 1; number <= 5; number++) {
        items.push(
            <Pagination.Item key={number} active={number === active}>
                {number}
            </Pagination.Item>

        )
    }
    return (
        <div className="">
            <Pagination size="md">
                <Pagination.First/>
                <Pagination.Prev/>
                {items}
            </Pagination>
        </div>
    )
}