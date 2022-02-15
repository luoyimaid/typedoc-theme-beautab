import { JSX, PageEvent, Reflection } from 'typedoc';
import { DeclarationReflection } from 'typedoc/dist/lib/models/reflections/declaration';

interface IItem extends Reflection {
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
export const navigation =
  (urlTo: (reflection: Reflection) => string | undefined) =>
  (props: PageEvent<Reflection>): JSX.Element => {
    const categories = formatFileBeautab(props.model.project.children || []);

    return (
      <div class='tree'>
        <Navigation {...categories} urlTo={urlTo} />
      </div>
    );
  };

/**
 * 导航栏布局.
 */
const Navigation = ({
  id,
  categories,
  items,
  urlTo,
}: ICategory & {
  urlTo: (reflection: Reflection) => string | undefined;
}): JSX.Element => (
  <ul class='js-category-list category' data-id={id}>
    {Object.entries(categories).map(([key, item]) => (
      <li>
        <span class='js-category-title category__title' data-id={item.id}>
          <div class='category__folder js-category-icon' data-id={item.id} />
          {key}
        </span>
        <Navigation
          id={item.id}
          categories={item.categories}
          items={item.items}
          urlTo={urlTo}
        />
      </li>
    ))}
    {items.map((item) => (
      <li>
        <a
          class='category__link js-category-link category__link--ts'
          href={urlTo(item)}
          data-id={item.url && `/${item.url}`}
        >
          {item.title}
        </a>
        <ul>
          {item.children?.map((subItem: Reflection) => (
            <li class={subItem.cssClasses}>
              <a
                class='category__link tsd-kind-icon js-category-link'
                href={urlTo(subItem)}
                data-id={subItem.url && `/${subItem.url}`}
              >
                {subItem.name}
              </a>
            </li>
          ))}
        </ul>
      </li>
    ))}
  </ul>
);

const formatFileBeautab = (values: DeclarationReflection[]): ICategory => {
  const result: ICategory = {
    id: 'root',
    items: [],
    categories: {},
  };

  for (const item of values) {
    const titleSplit = (item.name || '').split('/');

    addToCategory(result, item, titleSplit, 0);
  }

  return result;
};

const addToCategory = (
  category: ICategory,
  item: DeclarationReflection,
  titleSplit: string[],
  idx: number,
): void => {
  if (idx === titleSplit.length - 1) {
    if (!category.items) {
      // eslint-disable-next-line no-param-reassign
      category.items = [];
    }

    const fileName = item?.sources?.[0]?.file?.name;

    if (!fileName) {
      return;
    }

    category.items.push({
      ...item,
      title: fileName,
    } as IItem);

    return;
  }

  const title = titleSplit[idx];

  if (!title) {
    return;
  }

  if (!category.categories[title]) {
    // eslint-disable-next-line no-param-reassign
    category.categories[title] = {
      items: [],
      categories: {},
      id: `${category.id}-${title}`,
    };
  }

  const categoryToAdd = category.categories[title];

  if (!categoryToAdd) {
    return;
  }

  addToCategory(categoryToAdd, item, titleSplit, idx + 1);
};
