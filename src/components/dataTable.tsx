import {
    Table,
    Toggle,
    TagPicker,
    Button,
    ColumnProps,
    Pagination,
    Col,
    IconButton,
    ButtonGroup,
    Whisper,
    SelectPicker, Popover, Dropdown, FlexboxGrid
} from 'rsuite';
import {useEffect, useState} from "react";
import {teams} from "./team";
import {Input, InputGroup, Grid, Row} from 'rsuite';
import SearchIcon from '@rsuite/icons/Search';
import * as timers from "timers";
import {ProgressBar} from "./progress-bar";
import Progress from "rsuite/Progress";
import AddOutlineIcon from '@rsuite/icons/AddOutline';
import {DropdownMenu} from "rsuite/Picker";

const {Column, HeaderCell, Cell} = Table;

const CompactCell = (props: any) => <Cell {...props} style={{padding: 4}}/>;
const CompactHeaderCell = (props: any) => <HeaderCell {...props} style={{padding: 4}}/>;

const defaultColumns = [
    {
        key: 'id',
        fixed: true,
        width: 0,
    },
    {
        key: 'name',
        label: 'Team Name',
        fixed: true,
        width: 250,
        // flexGrow: 1,
    },
    {
        key: 'status',
        label: 'Status',
        fixed: true,
        width: 250,
        // flexGrow: 1,
    },
    {
        key: 'timeline',
        label: 'Project timeline',
        minWidth: 600,
        width: 600,
        flexGrow: 1
    },
    {
        key: 'projectLeader',
        label: 'Project Leader',
        width: 100,
        // flexGrow: 1


    },
    {
        key: 'category',
        label: 'Category',
        width: 175,
        // flexGrow: 1,

    },
    {
        key: 'accountManager',
        label: 'Account Manager',
        width: 100,
        // flexGrow: 1


    },
    {
        key: 'relationshipManager',
        label: 'Relationship Manager',
        width: 100,
        // flexGrow: 1

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
    const [data, setData] = useState<any>([]);
    const columns = defaultColumns.filter(column => columnKeys.some(key => key === column.key));
    const CustomHeaderCell = compact ? CompactHeaderCell : HeaderCell;
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [paginateSearch, setPaginateSearch] = useState<Ipaginate>({
        search: [],
        currentPage: 1,
        pageLimit: 10
    });

    const columnsOption = [...defaultColumns].map((team: any) => {
        return {
            value: team.key,
            label: team.label,
        }
    })

    const teamStatusOption: any[] = [];
    [...teams].forEach((team: any) => {
        if (!teamStatusOption.filter(opt => opt.value === team.status).length) {
            teamStatusOption.push({
                value: team.status,
                label: team.status,
            })
        }
    })

    // @ts-ignore
    useEffect(() => {
        let newData: any = []
        if (!paginateSearch.search.length) {
            newData = [...teams];
        } else {
            paginateSearch?.search.forEach((search: { label: string | number; value: string; }, index: any) => {
                [...teams].forEach(team => {
                    // @ts-ignore
                    const xx = Object.keys(team).filter(key => {
                        return !!paginateSearch.search.filter((ke: { label: string; }) => {
                            return ke.label === key
                        }).length
                    });

                    const contains = xx.some(val => {
                        // @ts-ignore
                        return team[val]?.toString().toLowerCase().includes(search.value?.toLowerCase())
                    })
                    if (contains && !(newData.some((data: any) => data.id === team.id))) {
                        newData.push(team);
                    }
                    // if (team[search.label]?.toLowerCase().includes(search.value?.toLowerCase())) {
                    //     // @ts-ignore
                    //     if (!(newData.some(data => data.id === team.id))) {
                    //         newData.push(team);
                    //     }
                    // }
                })
            });
        }
        const paginatedData = [...newData].slice((page - 1) * limit, limit * page);
        setData(paginatedData);
    }, [paginateSearch]);

    useEffect(() => {
        const newData = [...teams].slice((page - 1) * limit, limit * page);
        // @ts-ignore
        setData(newData);
    }, [page, limit])

    const onSearch = (searchName: any) => {

        const newSearch = [...paginateSearch.search];

        if (newSearch.some(val => val.label === 'name')) {
            newSearch.forEach(data => {
                if (data.label === 'name') {
                    data.value = searchName;
                }
            })
        } else {
            newSearch.push({
                value: searchName,
                label: 'name',
            })
        }
        setPaginateSearch({
            ...paginateSearch,
            search: newSearch,
        });
    }

    const populateSearchStatus = (values: any[]) => {
        const paginateObj = [...paginateSearch.search];
        [...paginateObj]?.forEach((criteria, i) => {
            if (criteria.label === 'status') {
                paginateObj.splice(i, 1);
            }
        });

        console.log([...paginateObj].length, 'obj', values.length)

        values.forEach(val => {
            paginateObj.push({
                label: 'status',
                value: val
            })
        })

        // @ts-ignore
        setPaginateSearch({
            pageLimit: paginateSearch?.pageLimit,
            currentPage: paginateSearch?.currentPage,
            search: paginateObj
        })
    }

    const [dropdownMenuOptions, setDropdownSearch] = useState([...columnsOption]);

    const renderMenu = ({onClose, left, top, className}: any, ref: any) => {

        const onInputChange = (searchName: string) => {
            let newData: any[] = [];
            if (searchName) {
                columnsOption.forEach(option => {
                    if (option.value.toLowerCase().includes(searchName.toLowerCase())) {
                        newData.push(option);
                    }
                })
                setDropdownSearch(newData);
            } else {
                setDropdownSearch([...columnsOption]);
            }

        }
        // @ts-ignore
        // eslint-disable-next-line react/jsx-no-undef
        return (<>
                {/* eslint-disable-next-line react/jsx-no-undef */}
                <Popover ref={ref} className={className} style={{left, top}} full>
                    {/*<Input onChange={onInputChange}></Input>*/}
                    {/*<Dropdown.Menu>*/}
                    {/*    {dropdownMenuOptions.map((data, key) => {*/}

                    {/*        return (*/}
                    {/*            <Dropdown.Item eventKey={data.value}>{data.label}</Dropdown.Item>*/}
                    {/*        )*/}
                    {/*    })}*/}
                    {/*</Dropdown.Menu>*/}

                    <SelectPicker
                        data={dropdownMenuOptions}
                        labelKey="label"
                        valueKey="key"
                        value={columnKeys}
                        cleanable={false}
                    />

                </Popover>
            </>
        )
    }
    // @ts-ignore
    // @ts-ignore
    return (
        <div style={{
            width: '100%',
            paddingTop: '30px',
            display: 'flex',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <div style={{width: '85%'}}>
                <div style={{width: '100%'}}>
                    {/* eslint-disable-next-line react/jsx-no-undef */}
                    <FlexboxGrid justify="end">
                        <FlexboxGrid.Item colspan={6}>
                            <CustomInputGroup
                                size="12"
                                placeholder="Search By Name"
                                onInputChange={onSearch}/>
                        </FlexboxGrid.Item>

                        <FlexboxGrid.Item colspan={6}>
                            <TagPicker data={teamStatusOption}
                                       style={{width: 300}}
                                       onChange={populateSearchStatus}
                            />
                        </FlexboxGrid.Item>
                        <FlexboxGrid.Item colspan={3}> <IconButton icon={<AddOutlineIcon/>}>Add</IconButton>
                        </FlexboxGrid.Item>
                        <FlexboxGrid.Item colspan={4}>
                            <div>
                                {/* eslint-disable-next-line react/jsx-no-undef */}
                                <ButtonGroup>
                                    <Button>Create</Button>
                                    {/* eslint-disable-next-line react/jsx-no-undef */}
                                    {/*<Whisper placement="bottomStart" trigger="click" speaker={renderMenu}>*/}
                                    {/*    /!* eslint-disable-next-line react/jsx-no-undef *!/*/}
                                    {/*    <IconButton icon={<AddOutlineIcon/>}/>*/}
                                    {/*</Whisper>*/}
                                </ButtonGroup>
                            </div>
                        </FlexboxGrid.Item>
                    </FlexboxGrid>
                </div>

                <div style={{padding: '10px'}}>
                    <Table
                        loading={loading}
                        height={600}
                        hover={true}
                        data={noData ? [] : data}
                    >
                        {columns.map((column) => {
                            const {key, label, ...rest} = column;
                            return (
                                <Column {...rest}
                                        key={key}
                                        align={'left'}
                                >
                                    <CustomHeaderCell>{label}</CustomHeaderCell>
                                    {/*<CustomCell dataKey={key}/>*/}
                                    <Cell>
                                        {rowData => {
                                            if (key === 'timeline') {
                                                const percent = ((new Date(rowData['endDate']).getUTCDate() - new Date(rowData['startDate']).getUTCDate()) / new Date(rowData['endDate']).getUTCDate()) * 100
                                                return (
                                                    <FlexboxGrid justify={"start"} align={"middle"}>
                                                        <FlexboxGrid.Item colspan={4}>
                                                            {new Date(rowData['startDate']).toDateString()}
                                                        </FlexboxGrid.Item>
                                                        <FlexboxGrid.Item colspan={6}>
                                                            <Progress.Line
                                                                percent={percent}
                                                                status="success"
                                                                showInfo={false}
                                                            />
                                                        </FlexboxGrid.Item>
                                                        <FlexboxGrid.Item colspan={4}>
                                                            {new Date(rowData['endDate']).toDateString()}
                                                        </FlexboxGrid.Item>
                                                    </FlexboxGrid>
                                                )
                                            } else if (key === 'name') {
                                                return <span><img alt="avatar"
                                                                  style={{width: 30, height: 30}}
                                                                  src="https://images.vyaguta.lftechnology.com/projects/logo/48/224.png"/>
                                    <span style={{paddingLeft:'8px'}}>{rowData[key]} </span>
                                    </span>
                                            } else if (key === 'projectLeader' ||
                                                key === 'accountManager' || key === 'relationshipManager') {

                                                return <span><img alt="avatar"
                                                                  style={{width: 30, height: 30}}
                                                                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/220px-User_icon_2.svg.png"/>
                                    <span>{rowData[key].fullname.split(' ')
                                        .map((s: any) => String.fromCodePoint(s.codePointAt(0) || '').toUpperCase())
                                        .join('')
                                    }
                                    </span>
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
                        activePage={paginateSearch.currentPage}
                        onChangePage={setPage}
                        onChangeLimit={setLimit}
                    />
                </div>
            </div>
        </div>
    )
        ;
};


export interface Ipaginate {
    currentPage: number,
    pageLimit
        :
        number
    search: [{
        value?: string | number,
        label?: string
    }] | any

}