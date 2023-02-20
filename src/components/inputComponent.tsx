import {InputGroup} from "rsuite";

export const InputComponent = (props: any) => {

    return <div>
        {props.data.map((data: any) => {

            return <div>
                <InputGroup>
                    <span>
                        <InputComponent/>
                    </span>
                    <span>

                    </span>
                </InputGroup>
            </div>
        })}

    </div>
}