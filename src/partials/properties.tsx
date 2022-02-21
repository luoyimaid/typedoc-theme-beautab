import {
    JSX,
    ContainerReflection,
    ReflectionGroup,
    ReferenceType
} from 'typedoc';
import { DeclarationReflection } from 'typedoc/dist/lib/models/reflections/declaration';

interface ICategory {
    groups: ReflectionGroup[];
}

interface TabIntroduceInterface {
    value: DeclarationReflection
}

interface typeInterface {
    types: typesInterface[],
    type: string
}

interface typesInterface {
    type: string;
    value: string;
    name: string;
    elementType: elementTypeInterface
}

interface elementTypeInterface {
    type: string;
    id: number;
    name: string;
}

interface CommentInterface {
    tags: tagsInterface[];
    shortText?: string;
    text?: string;
};

interface tagsInterface {
    tagName: string;
    text: string;
}

const kindString = ['Interfaces', 'Methods', 'Properties', 'Type aliases'];

/**
 * 渲染分页面API面板
 */
export const container =
    (urlTo: (reflection: ContainerReflection) => string | undefined) =>
    (props: ContainerReflection): JSX.Element => {
        const groups = props.groups || [];

        return (
            <div class='container'>
                <MemberContainer groups={groups} urlTo={urlTo} />
            </div>
        );
    };

const MemberContainer = ({groups, urlTo}: ICategory & {
    urlTo: (reflection: ContainerReflection) => string | undefined;
}): JSX.Element => <div>
    {groups.map((item, index) => (item.title === kindString[2] || item.title === kindString[3])
        ? <div>
            <h2>{item.title}</h2>
            <table>
                <thead>
                    <tr>
                        <th scope="col">属性</th>
                        <th scope="col">说明</th>
                        <th scope="col">类型</th>
                        <th scope="col">默认值</th>
                    </tr>
                </thead>
                <TabTypeMemberContainer children={item.children} urlTo={urlTo} />
            </table>
        </div> : null)
    }
</div>;

const TabTypeMemberContainer = ({children, urlTo}: any & {
    urlTo: (reflection: ContainerReflection) => string | undefined;
}): JSX.Element => <tbody>
    {children && children.map((item: DeclarationReflection) => (<tr>
        {/* API名称 */}
        <td><a href={urlTo(item)}>{item.originalName}</a></td>
        {/* 说明和值的罗列 */}
        <TabTypeIntroduce value={item}/>
        {/* 数据类型；类型强转 */}
        <td>{(item.type as ReferenceType)?.name || item.type?.type}</td>
        {/* 默认值 */}
        <TabDefault tags={(item.comment as unknown as CommentInterface)?.tags || []}/>
    </tr>))}
</tbody>;

const TabTypeIntroduce = ({value}: TabIntroduceInterface) => {
    let result: string | undefined = '';
    const type = value.type as unknown as typeInterface;

    type.type === 'union' && type.types.map(item => {
        result += `${item.value || item.name} | `;
        return result;
    });

    return <td>
        {value.comment?.shortText}
        {result ? <br /> : null}
        {result ? `mode: ${result}` : ''}
    </td>
};

const TabDefault = ({tags}: CommentInterface): JSX.Element => {
    let defaultValue: string = '_';
    for (let item of tags) {
        if (item.tagName && item.tagName === 'default') {
            defaultValue = item.text;
        }
    }
    return <td>{defaultValue}</td>
};
