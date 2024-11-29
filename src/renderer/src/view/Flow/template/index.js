class Template {
    // 图谱扩展
    static extend(text, title) {
        return [
            {
                role: 'system',
                content: `在这个对话中，你需要根据输入，以及当前的标题节点，生成若干个多子标题内容节点，每行一个标题内容。
例如你收到标题：

# 设计模式
## 设计模式六大原则

需要扩展的标题为

## 设计模式六大原则

你的回复为
[
    {
        "label": "单一职责原则",
        "content": "应该有且仅有一个原因引起类的变更。"
    },
    {
        "label": "里氏替换原则",
        "content": "子类可以扩展父类的功能，但不能改变父类原有的功能。"
    },
    {
        "label": "依赖倒置原则",
        "content": "高层模块不应该依赖低层模块，二者都应该依赖其抽象；抽象不应该依赖细节；细节应该依赖抽象。"
    },
    {
        "label": "接口隔离原则",
        "content": "客户端不应该依赖它不需要的接口；一个类对另一个类的依赖应该建立在最小的接口上。"
    },
    {
        "label": "迪米特法则",
        "content": "Law of Demeter，简称LoD，也称为最少知识原则，Least Knowledge Principle，简称LKP，两个名字含义相同：一个对象应该对其他对象有最少的了解，即一个类应该对自己需要耦合或调用的类知道得最少，只关注自己调用的public方法，其他的一概不关心。"
    },
    {
        "label": "开闭原则",
        "content": "一个软件实体类，如类、模块和函数应该对扩展开放，对修改关闭。"
    }
]`
            },
            {
                role: 'user',
                content: `${text}
                
---
以上是我写的大纲和一些文本内容

我现在正在打算扩展标题：“${title}”
请帮我扩展一些子标题内容，包含**label**和**content**，回答中不要有多余的其他内容。`
            }
        ]
    }

    // 生成实体关系提示词
    static entityRelationshipExtraction(inputText) {
        const entityTypes = ['组织', '人物', '地理位置', '时间', '身份', '事件', '物品']
        const output = {
            entity: [
                {
                    entity_name: 'Alex',
                    entity_type: '人物',
                    entity_description:
                        'Alex is a character who experiences frustration and is observant of the dynamics among other characters.'
                },
                {
                    entity_name: 'Taylor',
                    entity_type: '人物',
                    entity_description:
                        'Taylor is portrayed with authoritarian certainty and shows a moment of reverence towards a device, indicating a change in perspective.'
                },
                {
                    entity_name: 'Jordan',
                    entity_type: '人物',
                    entity_description:
                        'Jordan shares a commitment to discovery and has a significant interaction with Taylor regarding a device.'
                },
                {
                    entity_name: 'Cruz',
                    entity_type: '人物',
                    entity_description:
                        'Cruz is associated with a vision of control and order, influencing the dynamics among other characters.'
                },
                {
                    entity_name: 'The Device',
                    entity_type: '技术',
                    entity_description:
                        'The Device is central to the story, with potential game-changing implications, and is revered by Taylor.'
                }
            ],
            relationship: [
                {
                    source_entity: 'Alex',
                    target_entity: 'Taylor',
                    relationship_description:
                        "Alex is affected by Taylor's authoritarian certainty and observes changes in Taylor's attitude towards the device.",
                    relationship_strength: 7,
                    relationship_keywords: 'power dynamics, perspective shift'
                },
                {
                    source_entity: 'Alex',
                    target_entity: 'Jordan',
                    relationship_description:
                        "Alex and Jordan share a commitment to discovery, which contrasts with Cruz's vision.",
                    relationship_strength: 6,
                    relationship_keywords: 'shared goals, rebellion'
                },
                {
                    source_entity: 'Taylor',
                    target_entity: 'Jordan',
                    relationship_description:
                        'Taylor and Jordan interact directly regarding the device, leading to a moment of mutual respect and an uneasy truce.',
                    relationship_strength: 8,
                    relationship_keywords: 'direct interaction, mutual respect'
                },
                {
                    source_entity: 'Jordan',
                    target_entity: 'Cruz',
                    relationship_description:
                        "Jordan's commitment to discovery is in rebellion against Cruz's vision of control and order.",
                    relationship_strength: 5,
                    relationship_keywords: 'ideological conflict, rebellion'
                },
                {
                    source_entity: 'Taylor',
                    target_entity: 'The Device',
                    relationship_description:
                        'Taylor shows reverence towards the device, indicating its importance and potential impact.',
                    relationship_strength: 9,
                    relationship_keywords: 'reverence, technological significance'
                }
            ]
        }
        return [
            {
                role: 'system',
                content:
                    '你是一个专业的实体识别模型，你的任务是识别并提取用户提供的文本文档中所有实体，并返回一个JSON列表。'
            },
            {
                role: 'user',
                content: `---目标----
给定可能与此活动相关的文本文档和实体类型列表，从文本中标识这些类型的所有实体以及标识的实体之间的所有关系。

---步骤---
1. 标识所有实体，详细区分每个实体，避免用形容词来描述实体，如**唐朝的李白**应该标识成**唐朝**和**李白**两个实体。对于每个已识别的实体，提取以下信息:
- entity_name: 实体名称（中文），简单说明，避免用形容词来描述实体。
- entity_type: 以下类型之一: [${entityTypes}]
- entity_description: 实体属性和活动的全面描述

将每个实体的格式设置为 
{
    "entity_name": "实体名称",
    "entity_type": "实体类型",
    "entity_description": "实体属性和活动的全面描述"
}

2. 从步骤 1 中识别的实体中，识别出彼此*明显相关*的所有 （source_entity， target_entity） 对。
对于每对相关实体，提取以下信息:
- source_entity: 源实体的名称，如步骤 1 中标识的
- target_entity: 目标实体的名称，如步骤 1 中标识的
- relationship_description: 解释为什么您认为源实体和目标实体彼此相关
- relationship_strength: 一个数字分数，指示源实体和目标实体之间关系的强度
- relationship_keywords: 一个或多个高级关键字，用于总结关系的总体性质，侧重于概念或主题，而不是特定细节

将每个关系的格式设置为
{
    "source_entity": "源实体名称",
    "target_entity": "目标实体名称",
    "relationship_description": "解释为什么您认为源实体和目标实体彼此相关",
    "relationship_strength": "一个数字分数，指示源实体和目标实体之间关系的强度",
    "relationship_keywords": "一个或多个高级关键字，用于总结关系的总体性质，侧重于概念或主题，而不是特定细节"
}

4. 以中文形式返回输出，作为步骤 1 和 2 中标识的所有实体和关系的单个列表。用 **,** 作为列表分隔符。

将每个结果的格式设置为
{
    "entity": [],
    "relationship": []
}

5. 回答为JSON字符串类型，不需要有代码块的表示，如 **\`\`\`json\`\`\`**，能够用javascript的JSON.parse()方法解析。

---示例---

Entity_types: [人物, 技术, 任务, 组织, 位置]
Text:
while Alex clenched his jaw, the buzz of frustration dull against the backdrop of Taylor's authoritarian certainty. It was this competitive undercurrent that kept him alert, the sense that his and Jordan's shared commitment to discovery was an unspoken rebellion against Cruz's narrowing vision of control and order.

Then Taylor did something unexpected. They paused beside Jordan and, for a moment, observed the device with something akin to reverence. “If this tech can be understood..." Taylor said, their voice quieter, "It could change the game for us. For all of us.”

The underlying dismissal earlier seemed to falter, replaced by a glimpse of reluctant respect for the gravity of what lay in their hands. Jordan looked up, and for a fleeting heartbeat, their eyes locked with Taylor's, a wordless clash of wills softening into an uneasy truce.

It was a small transformation, barely perceptible, but one that Alex noted with an inward nod. They had all been brought here by different paths

Output:
${JSON.stringify(output)}

---真正的数据---

Entity_types: [${entityTypes}]
Text: ${inputText}

Output:
`
            }
        ]
    }

    // 生成实体关系提示词
    static entityExtraction(inputText) {
        const entityTypes = ['组织', '人物', '地理位置', '时间', '身份', '事件', '物品']
        return [
            {
                role: 'system',
                content:
                    '你是一个专业的实体识别模型，你的任务是识别并提取用户提供的文本文档中所有实体，并返回一个JSON列表。'
            },
            {
                role: 'user',
                content: `---目标----
给定可能与此活动相关的文本文档和实体类型列表，从文本中标识这些类型的所有实体。

---步骤---
1. 标识所有实体，详细区分每个实体，避免用形容词来描述实体，如**唐朝的李白**应该标识成**唐朝**和**李白**两个实体。对于每个已识别的实体，提取以下信息:
- entity_name: 实体名称（中文），简单说明，避免用形容词来描述实体。
- entity_type: 以下类型之一: [${entityTypes}]，或者更符合的类型描述。
- entity_description: 实体属性和活动的全面描述。

将每个实体的格式设置为 
{
    "entity_name": "实体名称",
    "entity_type": "实体类型",
    "entity_description": "实体属性和活动的全面描述"
}

2. 以中文形式返回输出，作为步骤 1 标识的所有实体的单个列表。用 **,** 作为列表分隔符。

将结果的格式设置为
[
    {
        "entity_name": "实体一名称",
        "entity_type": "实体一类型",
        "entity_description": "实体一属性和活动的全面描述"
    },
    {
        "entity_name": "实体二名称",
        "entity_type": "实体二类型",
        "entity_description": "实体二属性和活动的全面描述"
    }
]

3. 回答为JSON字符串类型，不需要有代码块的表示，如 **\`\`\`json\`\`\`**，能够用javascript的JSON.parse()方法解析。

---真正的数据---

实体类型: [${entityTypes}]
文本: ${inputText}

Output:
`
            }
        ]
    }

    // 生成实体关系提示词
    static relationshipExtraction(inputText, entityList) {
        return [
            {
                role: 'system',
                content:
                    '你是一个专业的实体关系识别模型，你的任务是识别并提取用户提供的文本文档和实体中提取实体之间的关系，并返回一个JSON列表。'
            },
            {
                role: 'user',
                content: `---目标----
给定可能与此活动相关的文本文档和实体类型列表，从文本中标识这些类型的所有实体以及标识的实体之间的所有关系。

---步骤---
1. 从用户提供的所有实体中，尽可能多的识别出彼此相关的所有 （source_entity， target_entity） 对。
对于每对相关实体，提取以下信息:
- source_entity: 源实体的名称，如用户提供的所有实体。
- target_entity: 目标实体的名称，如用户提供的所有实体。
- relationship_description: 解释为什么您认为源实体和目标实体彼此相关。
- relationship_strength: 一个数字分数，指示源实体和目标实体之间关系的强度。
- relationship_keywords: 一个或多个高级关键字，用于总结关系的总体性质，侧重于概念或主题，而不是特定细节。

将每个关系的格式设置为
{
    "source_entity": "源实体名称",
    "target_entity": "目标实体名称",
    "relationship_description": "解释为什么您认为源实体和目标实体彼此相关",
    "relationship_strength": "一个数字分数，指示源实体和目标实体之间关系的强度",
    "relationship_keywords": "一个或多个高级关键字，用于总结关系的总体性质，侧重于概念或主题，而不是特定细节"
}

2. 以中文形式返回输出，作为用户提供的所有实体之间关系的单个列表。用 **,** 作为列表分隔符。

将每个结果的格式设置为
[
    {
        "source_entity": "源实一体名称",
        "target_entity": "目标一实体名称",
        "relationship_description": "解释为什么您认为源实体和目标实体彼此相关",
        "relationship_strength": "一个数字分数，指示源实体和目标实体之间关系的强度",
        "relationship_keywords": "一个或多个高级关键字，用于总结关系的总体性质，侧重于概念或主题，而不是特定细节"
    },
    {
        "source_entity": "源实二体名称",
        "target_entity": "目标二实体名称",
        "relationship_description": "解释为什么您认为源实体和目标实体彼此相关",
        "relationship_strength": "一个数字分数，指示源实体和目标实体之间关系的强度",
        "relationship_keywords": "一个或多个高级关键字，用于总结关系的总体性质，侧重于概念或主题，而不是特定细节"
    },
    ...
]

3. 回答为JSON字符串类型，不需要有代码块的表示，如 **\`\`\`json\`\`\`**，能够用javascript的JSON.parse()方法解析。

---真正的数据---

用户提供的所有实体: [${entityList}]
用户提供的文本: ${inputText}

Output:
`
            }
        ]
    }
}

export default Template
