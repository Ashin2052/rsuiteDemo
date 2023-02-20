import {
    Table,
    TagPicker,
    Button,
    Pagination,
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
import FlexboxGridItem from "rsuite/cjs/FlexboxGrid/FlexboxGridItem";
import {defaultColumns} from "./column";

const {Column, HeaderCell, Cell} = Table;

const CompactHeaderCell = (props: any) => <HeaderCell {...props} style={{padding: 4}}/>;


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
    const [activeColumns, setActiveColumns] = useState(defaultColumns.map(column => column.key));
    const [data, setData] = useState<any>([]);
    const columns = defaultColumns.filter(column => activeColumns.some(key => key === column.key));
    const CustomHeaderCell = compact ? CompactHeaderCell : HeaderCell;
    const [paginateSearch, setPaginateSearch] = useState<Ipaginate>({
        search: {},
        currentPage: 1,
        pageLimit: 10
    });
    const teamStatusOption: any[] = [{
        value: 'In Progress',
        label: 'In Progress',
    }, {
        value: 'Lead',
        label: 'Lead',
    }
    ]

    const [columnFilter, setColumnFilter] = useState<any[]>([]);
    const [activeFilteredColumns, setActiveFilteredColumns] = useState<any[]>([]);


    useEffect(() => {
        const temp: any[] = [];
        (activeColumns.forEach(data => {
            if (data === 'id' || data === 'status' || data === 'name' || data === 'timeline') {
                return;
            }
            let column = defaultColumns.find(clm => clm.key === data);
            if (column) {
                temp.push({
                    ...column,
                    value: column.key
                });
            }
        }))
        setColumnFilter(temp);
    }, [activeColumns])

    // @ts-ignore
    useEffect(() => {
        let newData: any = []
        const filteredColumn = Object.keys(paginateSearch.search);
        if (!filteredColumn.length) {
            newData = [...teams];
        } else {
            [...teams].forEach((row: any) => {

                const containsValue = filteredColumn.every((column: string, index: number) => {
                    let rowValue = (row[column].fullname ? row[column].fullname : row[column]).toString().trim()
                        .toLowerCase();
                    let searchedValue = paginateSearch.search[column].toString().trim().toLowerCase();
                    return rowValue.includes(searchedValue);
                })
                if (containsValue) {
                    newData.push(row);
                }
            });
        }

        const paginatedData = [...newData].slice((paginateSearch.currentPage - 1) * paginateSearch.pageLimit, paginateSearch.pageLimit * paginateSearch.currentPage);
        if (newData.length) {
            setNoData(false)
        } else {
            setNoData(true)
        }
        setData(paginatedData);
    }, [paginateSearch]);


    /** Search
     **/
    const onSearch = (searchedKeyword: string | [], searchColumn: string) => {
        const newSearch = {...paginateSearch.search};
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
            search: newSearch,
        });
    }

    const onCLoseFilter = (column: string) => {
        const searchObject = {...paginateSearch.search}
        delete searchObject[column];
        setPaginateSearch({
            ...paginateSearch,
            search: searchObject
        })
    };

    const addColumnFilter = (data: any) => {
        setActiveFilteredColumns(data);
    };

    const renderMenu = ({onClose, left, top, className}: any, ref: any) => {
        const addColumnFilter = (data: any) => {
            setActiveFilteredColumns(data);
        };
        return (
            <Popover ref={ref} className={className}>
                <div>
                    <TagPicker
                        data={columnFilter}
                        labelKey="label"
                        open={true}
                        valueKey="key"
                        onChange={addColumnFilter}
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
                        value={activeColumns}
                        onClean={() => {
                            // [Object.keys(paginateSearch.search)].forEach((column) => {
                            //     onCLoseFilter(column);
                            // })
                        }}
                        onChange={setActiveColumns}
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
                                       placeholder="Status"
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
                        <FlexboxGridItem>
                            <TagPicker
                                data={columnFilter}
                                labelKey="label"
                                valueKey="key"
                                placeholder={'Column Filter'}
                                onChange={addColumnFilter}
                                onClean={() => {
                                    activeFilteredColumns.forEach((column: string) => {
                                        onCLoseFilter(column);
                                    })
                                }
                                }
                                cleanable={true}
                                style={{width: 350}}
                            />
                        </FlexboxGridItem>

                        {/*<FlexboxGrid.Item colspan={6}>*/}
                        {/*    <ButtonGroup>*/}
                        {/*        <Whisper placement={"autoVerticalStart"} trigger="click" speaker={renderMenu}>*/}
                        {/*            <div>*/}
                        {/*                <Button>Add Filter</Button>*/}
                        {/*                <IconButton icon={<AddOutlineIcon/>}/>*/}
                        {/*            </div>*/}
                        {/*        </Whisper>*/}
                        {/*    </ButtonGroup>*/}
                        {/*</FlexboxGrid.Item>*/}
                    </FlexboxGrid>
                    <FlexboxGrid>
                        <FlexboxGrid.Item>
                            {[...activeFilteredColumns].map((column, key) => {

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
                        size="md"
                        layout={['total', '-', 'limit', '|', 'pager', 'skip']}
                        total={teams.length}
                        limitOptions={[10, 20, 30]}
                        limit={paginateSearch.pageLimit}
                        activePage={paginateSearch.currentPage}
                        onChangePage={(page) => {
                            setPaginateSearch({
                                ...paginateSearch,
                                currentPage: page,
                            })
                        }
                        }
                        onChangeLimit={(limit) => {
                            setPaginateSearch({
                                ...paginateSearch,
                                pageLimit: limit,
                            })
                        }
                        }
                    />
                </div>
            </div>
        </div>
    )
        ;
};


export interface Ipaginate {
    currentPage: number,
    pageLimit: number,
    search: { [key: string]: string },

}