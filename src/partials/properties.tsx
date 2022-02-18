import { JSX, ContainerReflection, ReflectionGroup, Reflection, SomeType, UnionType } from 'typedoc';
import { DeclarationReflection } from 'typedoc/dist/lib/models/reflections/declaration';
interface ICategory {
    groups: ReflectionGroup[];
}

/**
 * 渲染
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
    {groups.map((item, index) => item.title !== 'Interfaces' ? <div>
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
            <TabMemberContainer children={item.children} urlTo={urlTo} />
        </table>
    </div> : null)}
</div>;

const TabMemberContainer = ({children, urlTo}: any & {
    urlTo: (reflection: ContainerReflection) => string | undefined;
}): JSX.Element => <tbody>
    {children.children && children.children.map((item: DeclarationReflection) => (<tr>
        <td><a href={urlTo(item)}>{item.originalName}</a></td>
        <TabIntroduce value={item}/>
        <td>{item.type?.type}</td>
        <td>{item.defaultValue || '_'}</td>
    </tr>))}
</tbody>;


interface TabIntroduceInterface {
    value: DeclarationReflection
}

const TabIntroduce = ({value}: TabIntroduceInterface) => {
    let result: string | undefined = '';
    let type: string | undefined = '';

    if (value.kindString === 'Type alias' && value.type?.type === 'union') {
        value.type?.types.map(item => {
            result += ` | ${item.type}`;
            return result;
        });
    }

    if (value.kindString === 'Property') {

    }

    return <td>
        {value.comment?.shortText}{result}
    </td>
}
