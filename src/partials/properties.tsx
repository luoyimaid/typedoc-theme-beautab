import { JSX, PageEvent, ContainerReflection } from 'typedoc';
import { DeclarationReflection } from 'typedoc/dist/lib/models/reflections/declaration';
import * as fs from 'fs';

interface IItem extends ContainerReflection {
    url: string;
    children: any;
    title: string;
}
interface ICategory {
    id: string;
    items: IItem[];
    categories: Record<string, ICategory>;
}

/**
 * 渲染导航栏.
 */
export const container =
    (urlTo: (reflection: ContainerReflection) => string | undefined) =>
    (props: PageEvent<ContainerReflection>): JSX.Element => {
        const categories = formatInterface(props.model.project.children || []);

        return (
            <div class='container'>
                <h1>Properties</h1>
                <ReflectionContainer {...categories} />
            </div>
        );
    };

const ReflectionContainer = (): JSX.Element => <table>
        我是一个表格
    </table>

const formatInterface = (value: DeclarationReflection[]) => {

}
