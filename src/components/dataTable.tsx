import {
    Table,
    TagPicker,
    Button,
    Pagination,
    IconButton,
    ButtonGroup,
    Whisper,
    SelectPicker, Popover, Dropdown, FlexboxGrid, CheckPicker, InputPicker, CheckboxGroup, Checkbox
} from 'rsuite';
import React, {useEffect, useState} from "react";
import {teams} from "./team";
import {Input, InputGroup, Grid, Row} from 'rsuite';
import SearchIcon from '@rsuite/icons/Search';
import Progress from "rsuite/Progress";
import FlexboxGridItem from "rsuite/cjs/FlexboxGrid/FlexboxGridItem";
import {defaultColumns} from "./column";
import ReactDOM from "react-dom/client";
import {createPortal} from "react-dom";
import Overlay from "rsuite/Overlay";
import PlusIcon from '@rsuite/icons/Plus';

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

    const addColumnFilter = (value: any) => {
        const filters = [...activeFilteredColumns];
        if (!activeFilteredColumns.some(col => col.key === value.key)) {
            filters.push(value);
        }
        setActiveFilteredColumns(filters);
    };
    const handleSelect = (val: any) => {
        console.log(val)
    }
    // @ts-ignore
    const renderMenu = ({onClose, left, top, className}: any, ref: any) => {
        return (
            <Popover ref={ref} className={className} style={{left, top}} full>
                <Dropdown.Menu onSelect={addColumnFilter}>
                    {[...columnFilter].map((value, key) => {
                        return <Dropdown.Item
                            key={key}
                            eventKey={value}>{value.label}</Dropdown.Item>
                    })}
                </Dropdown.Menu>
            </Popover>
        );
    }

    const renderColumnCheckPicker = ({onClose, left, top, className}: any, ref: any) => {
        return (
            <Popover ref={ref} className={className} style={{left, top}} full>
                <CheckboxGroup onChange={columnCheckboxSelect}
                               value={activeColumns}>
                    {[...defaultColumns].map((col, key) => {
                        return <Checkbox
                            key={key}
                            value={col.key}>{col.label}</Checkbox>
                    })}
                </CheckboxGroup>
            </Popover>
        );
    }


    const getDynamicSearchDataForColumnFilters: any = (
        key: 'string'
    ) => {
        const searchData: any[] = [];
        [...teams].forEach((row: any) => {
            if (!searchData.some(val => val.value === row[key]?.fullname || val.value === row[key])) {
                searchData.push({
                    label: row[key]?.fullname || row[key],
                    value: row[key]?.fullname || row[key],
                })
            }
        });
        return searchData;
    }
    const columnCheckboxSelect = (val: any) => {
        setActiveColumns(val)
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
                <FlexboxGrid style={{padding: '10px',}} justify={"space-between"}>
                    <FlexboxGridItem colspan={6}>
                        <div className="table-title__header ">
                            <div className="table-title__header--top-row d-flex align-items-center">
                                <div className="table-title__header--title mr-6x"><h2 className="title">Projects</h2>
                                    <span className="total-showing d-block">Showing 40 of 47 Projects</span></div>
                            </div>
                        </div>
                    </FlexboxGridItem>
                    <FlexboxGridItem colspan={6}>

                        <Whisper trigger="click"
                                 placement={"bottom"}
                                 speaker={renderColumnCheckPicker}
                                 style={{width: 'fit-content'}}
                        >
                            <div className="d-flex align-items-center" style={{}}>
                                <div className="tooltip mr-4x" data-tooltipped="" aria-describedby="tippy-tooltip-1"
                                     style={{display: 'inline'}}>
                                    <button type="button" className="add-columns-button">
                                        <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24"
                                             stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7m0-18H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7m0-18v18"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>

                        </Whisper>


                        {/*<CheckPicker*/}
                        {/*    data={defaultColumns}*/}
                        {/*    labelKey="label"*/}
                        {/*    valueKey="key"*/}
                        {/*    value={activeColumns}*/}
                        {/*    onChange={setActiveColumns}*/}
                        {/*    cleanable={false}*/}
                        {/*/>*/}
                    </FlexboxGridItem>
                </FlexboxGrid>

                {/*2nd section*/}
                <div style={{padding: '10'}}>
                    {/* eslint-disable-next-line react/jsx-no-undef */}
                    <FlexboxGrid justify="space-around">
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


                        <FlexboxGrid.Item colspan={3}>
                            <ButtonGroup>
                                <Whisper trigger="click"
                                         placement={"bottom"}
                                         speaker={renderMenu}
                                >
                                    <IconButton appearance="primary" icon={<PlusIcon/>} placement="left">
                                        Add Column Filter
                                    </IconButton>
                                </Whisper>
                            </ButtonGroup>
                        </FlexboxGrid.Item>
                    </FlexboxGrid>
                    <FlexboxGrid>
                        <FlexboxGrid.Item>
                            {[...activeFilteredColumns].map((column, key) => {
                                // @ts-ignore
                                return (
                                    <SelectPicker
                                        id={column}
                                        style={{width: 224, padding: '16px'}}
                                        placeholder={column.label}
                                        onSelect={(searchKeyword) => {
                                            onSearch(searchKeyword, column.key)
                                        }}
                                        onClean={() => {
                                            onCLoseFilter(column);
                                        }
                                        }
                                        data={getDynamicSearchDataForColumnFilters(column.key)}
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
                                    {/* eslint-disable-next-line react/jsx-no-undef */}
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
}


export interface Ipaginate {
    currentPage: number,
    pageLimit: number,
    search: { [key: string]: string },

}