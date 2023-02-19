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
import Progress from "rsuite/Progress";
import AddOutlineIcon from '@rsuite/icons/AddOutline';

const {Column, HeaderCell, Cell} = Table;

const CompactCell = (props: any) => <Cell {...props} style={{padding: 4}}/>;
const CompactHeaderCell = (props: any) => <HeaderCell {...props} style={{padding: 4}}/>;

const defaultColumns = [
    {
        key: 'id',
        label: 'Id',
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
        newSearch: {},
        currentPage: 1,
        pageLimit: 10
    });

    const [columnFilter, setColumnFilter] = useState<any[]>([]);
    const [columnFilterKeys, setColumnFilterKeys] = useState<any[]>([...columnFilter].map(column => column.key));


    useEffect(() => {
        const temp: any[] = [];
        ([...columnKeys].forEach(data => {
            if (data === 'id' || data === 'status' || data === 'name' || data === 'timeline') {
                return;
            }
            // @ts-ignore
            temp.push(defaultColumns.find(clm => clm.key === data));
        }))
        setColumnFilter(temp)
    }, [columnKeys])

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
        const filteredColumn = Object.keys(paginateSearch.newSearch);
        if (!filteredColumn.length) {
            newData = [...teams];
        } else {
            [...teams].forEach((row: any) => {
                let containsValue = false;
                filteredColumn.forEach((column: string, index: number) => {
                    let rowValue = (row[column].fullname ? row[column].fullname : row[column]).toString().trim()
                        .toLowerCase();
                    let searchedValue = paginateSearch.newSearch[column].toString().trim().toLowerCase();
                    containsValue = rowValue.includes(searchedValue);
                })

                if (containsValue && !(newData.some((data: any) => data.id === row.id))) {
                    newData.push(row);
                }
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


    /** Search
     **/
    const onSearch = (searchedKeyword: string | [], searchColumn: string) => {
        const newSearch = {...paginateSearch.newSearch};
        if (Array.isArray(searchedKeyword) && !searchedKeyword.length) {
            searchedKeyword = '';
        }
        if (!!searchedKeyword) {
            newSearch[searchColumn] = searchedKeyword.toString();
        } else {
            delete newSearch[searchColumn];
        }
        setPaginateSearch({
            ...paginateSearch,
            newSearch: newSearch,
        });
    }

    const onCLoseFilter = (column: string) => {
        const searchObject = {...paginateSearch.newSearch}
        delete searchObject[column];
        setPaginateSearch({
            ...paginateSearch,
            newSearch: searchObject
        })
    };

    const renderMenu = ({onClose, left, top, className}: any, ref: any) => {

        const addColumnFilter = (data: any) => {
            setColumnFilterKeys(data);
        };
        return (
            <Popover ref={ref} className={className}>
                <div>
                    <TagPicker
                        data={columnFilter}
                        labelKey="label"
                        open={true}
                        valueKey="key"
                        value={columnFilterKeys}
                        onChange={addColumnFilter}
                        onClean={() => {
                            // onCLoseFilter('status')
                        }
                        }
                        cleanable={true}
                        style={{width: 240}}
                        menuStyle={{width: 240}}
                    />
                </div>
            </Popover>
        )
    }


    const getDynamicSearchDataForColumnFilters: any = (key: 'string', page: any) => {
        const searchData: any[] = [];
        [...teams].forEach((row: any) => {
            if (!searchData.some(val => val.value === row[key]?.fullname || val.value === row[key])) {
                searchData.push({
                    label: row[key]?.fullname || row[key],
                    value: row[key]?.fullname || row[key],
                })
            }
        })
        return searchData;
    }


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

                {/*1st dynamic column section*/}
                <div style={{padding: '10px'}}>
                    <TagPicker
                        data={defaultColumns}
                        labelKey="label"
                        valueKey="key"
                        value={columnKeys}
                        onChange={setColumnKeys}
                        cleanable={false}
                    />
                </div>

                {/*2nd section*/}
                <div style={{padding: '10'}}>
                    {/* eslint-disable-next-line react/jsx-no-undef */}
                    <FlexboxGrid justify="end">
                        <FlexboxGrid.Item colspan={6}>
                            <CustomInputGroup
                                size="12"
                                placeholder="Search By Name"
                                onInputChange={(searchedValue: string) => {
                                    onSearch(searchedValue, 'name')
                                }
                                }/>
                        </FlexboxGrid.Item>

                        <FlexboxGrid.Item colspan={6}>
                            <TagPicker data={teamStatusOption}
                                       style={{width: 300}}
                                       onChange={(searchKeyword) => {
                                           onSearch(searchKeyword, 'status')
                                       }}
                                       onClean={() => {
                                           onCLoseFilter('status')
                                       }
                                       }
                            />
                        </FlexboxGrid.Item>

                        <FlexboxGrid.Item colspan={6}>
                            <ButtonGroup>
                                <Whisper placement={"autoVerticalStart"} trigger="click" speaker={renderMenu}>
                                    <div>
                                        <Button>Add</Button>
                                        <IconButton icon={<AddOutlineIcon/>}/>
                                    </div>
                                </Whisper>
                            </ButtonGroup>
                        </FlexboxGrid.Item>
                        <FlexboxGrid.Item colspan={3}> <IconButton icon={<AddOutlineIcon/>}>Add</IconButton>
                        </FlexboxGrid.Item>
                    </FlexboxGrid>
                    <FlexboxGrid>
                        <FlexboxGrid.Item>
                            {[...columnFilterKeys].map((column, key) => {

                                // @ts-ignore
                                // @ts-ignore
                                return (
                                    <SelectPicker
                                        id={column}
                                        style={{width: 224, padding: '16px'}}
                                        placeholder={columns.find(col => col.key === column)?.label}
                                        onSelect={(searchKeyword) => {
                                            onSearch(searchKeyword, column)
                                        }}
                                        onClean={() => {
                                            onCLoseFilter(column);
                                        }
                                        }
                                        data={getDynamicSearchDataForColumnFilters(column)}
                                        virtualized
                                    />
                                )
                            })}
                        </FlexboxGrid.Item>
                    </FlexboxGrid>
                </div>

                {/*table section*/}
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
                                    <span style={{paddingLeft: '8px'}}>{rowData[key]} </span>
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
        number,
    newSearch: { [key: string]: string },

    search: [{
        value?: string | number,
        label?: string
    }] | any

}