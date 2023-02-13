import {Table, Toggle, TagPicker, Button, ColumnProps, Pagination, Col} from 'rsuite';
import {useEffect, useState} from "react";
import {teams} from "./team";
import {Input, InputGroup, Grid, Row} from 'rsuite';
import SearchIcon from '@rsuite/icons/Search';
import * as timers from "timers";
import {ProgressBar} from "./progress-bar";
import Progress from "rsuite/Progress";

const {Column, HeaderCell, Cell} = Table;

const CompactCell = (props: any) => <Cell {...props} style={{padding: 4}}/>;
const CompactHeaderCell = (props: any) => <HeaderCell {...props} style={{padding: 4}}/>;

const defaultColumns = [
    {
        key: 'id',
        label: 'Id',
        fixed: true,
        width: 50,

    },
    {
        key: 'name',
        label: 'Team Name',
        fixed: true,
        width: 150,
    },
    {
        key: 'status',
        label: 'Status',
        fixed: true,
        width: 123,
    },
    {
        key: 'timeline',
        label: 'Project timeline',
        width: 123,
    },
    {
        key: 'projectLeader.fullname',
        label: 'Project Leader',
        width: 200
    },
    {
        key: 'category',
        label: 'Category',
        flexGrow: 1,

    },
    {
        key: 'accountManager.fullname',
        label: 'Account Manager',
        width: 123,
    },
    {
        key: 'relationshipManager.fullname',
        label: 'Relationship Manager',
        width: 123,
    }
];

const styles = {
    marginBottom: 10
};

// @ts-ignore
const CustomInputGroup = ({placeholder, ...props}) => (
    <InputGroup {...props} >
        <Input placeholder={placeholder} onChange={props.onInputChange}/>
        <InputGroup.Addon>
            <SearchIcon/>
        </InputGroup.Addon>
    </InputGroup>
);
export const TableComponent = () => {
    const [loading, setLoading] = useState(false);
    const [compact, setCompact] = useState(true);
    const [noData, setNoData] = useState(false);
    const [autoHeight, setAutoHeight] = useState(true);
    const [columnKeys, setColumnKeys] = useState(defaultColumns.map(column => column.key));
    const [data, setData] = useState([]);

    const columns = defaultColumns.filter(column => columnKeys.some(key => key === column.key));
    const CustomHeaderCell = compact ? CompactHeaderCell : HeaderCell;
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    useEffect(() => {
        console.log(page, 'afdasdfa');
        const newData = [...teams].slice((page - 1) * limit, limit * page);
        // @ts-ignore
        setData(newData);
    }, [page, limit])

    const onSearch = (searchName: any) => {
        const newData: any[] = [];
        [...teams].forEach(team => {
            if (team.name.toLowerCase().includes(searchName.toLowerCase())) {
                newData.push(team);
            }
        })
        // @ts-ignore
        setData(newData);
    }


    return (
        <div>
            <Row>
                <Col xs={24} sm={12} md={8}>
                    <CustomInputGroup size="sm" placeholder="Search By Name" onInputChange={onSearch}/>
                </Col>
            </Row>

            <div style={{height: autoHeight ? 'auto' : 400}}>
                <Table
                    loading={loading}
                    height={600}
                    hover={true}
                    data={noData ? [] : data}
                >
                    {columns.map((column) => {
                        const {key, label, ...rest} = column;
                        return (
                            <Column {...rest} key={key}>
                                <CustomHeaderCell>{label}</CustomHeaderCell>
                                {/*<CustomCell dataKey={key}/>*/}
                                <Cell>
                                    {rowData => {
                                        if (key === 'timeline') {
                                            const percent = ((new Date(rowData['endDate']).getUTCDate() - new Date(rowData['startDate']).getUTCDate()) / new Date(rowData['endDate']).getUTCDate()) * 100
                                            return <Progress.Line percent={percent} status="success" showInfo={false}/>
                                        } else if (key === 'name') {
                                            return <span><img alt="avatar"
                                                              style={{width: 30, height: 30}}
                                                              src="https://images.vyaguta.lftechnology.com/projects/logo/48/224.png"/>
                                                <span>{rowData[key]} </span>
                                            </span>
                                        }
                                        return <span>{rowData[key]}</span>;
                                    }
                                    }
                                </Cell>
                            </Column>
                        );
                    })}
                </Table>
            </div>
            <div style={{padding: 20}}>
                {/* eslint-disable-next-line react/jsx-no-undef */}
                <Pagination
                    prev
                    next
                    first
                    last
                    ellipsis
                    boundaryLinks
                    maxButtons={5}
                    size="xs"
                    layout={['total', '-', 'limit', '|', 'pager', 'skip']}
                    total={teams.length}
                    limitOptions={[10, 20, 30]}
                    limit={limit}
                    activePage={page}
                    onChangePage={setPage}
                    onChangeLimit={setLimit}
                />
            </div>
        </div>
    )
        ;
};
