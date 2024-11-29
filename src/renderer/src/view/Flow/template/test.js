const entityTypes = ['组织', '人物', '地理位置', '时间', '身份', '事件', '物品']
const inputText = ''

const entityExtraction = `---目标----
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
{"entity": [
        {
            "entity_name": "Alex",
            "entity_type": "人物",
            "entity_description": "Alex is a character who experiences frustration and is observant of the dynamics among other characters."
        },
        {
            "entity_name": "Taylor",
            "entity_type": "人物",
            "entity_description": "Taylor is portrayed with authoritarian certainty and shows a moment of reverence towards a device, indicating a change in perspective."
        },
        {
            "entity_name": "Jordan",
            "entity_type": "人物",
            "entity_description": "Jordan shares a commitment to discovery and has a significant interaction with Taylor regarding a device."
        },
        {
            "entity_name": "Cruz",
            "entity_type": "人物",
            "entity_description": "Cruz is associated with a vision of control and order, influencing the dynamics among other characters."
        },
        {
            "entity_name": "The Device",
            "entity_type": "技术",
            "entity_description": "The Device is central to the story, with potential game-changing implications, and is revered by Taylor."
        }
    ],
    "relationship": [
        {
            "source_entity": "Alex",
            "target_entity": "Taylor",
            "relationship_description": "Alex is affected by Taylor's authoritarian certainty and observes changes in Taylor's attitude towards the device.",
            "relationship_strength": 7,
            "relationship_keywords": "power dynamics, perspective shift"
        },
        {
            "source_entity": "Alex",
            "target_entity": "Jordan",
            "relationship_description": "Alex and Jordan share a commitment to discovery, which contrasts with Cruz's vision.",
            "relationship_strength": 6,
            "relationship_keywords": "shared goals, rebellion"
        },
        {
            "source_entity": "Taylor",
            "target_entity": "Jordan",
            "relationship_description": "Taylor and Jordan interact directly regarding the device, leading to a moment of mutual respect and an uneasy truce.",
            "relationship_strength": 8,
            "relationship_keywords": "direct interaction, mutual respect"
        },
        {
            "source_entity": "Jordan",
            "target_entity": "Cruz",
            "relationship_description": "Jordan's commitment to discovery is in rebellion against Cruz's vision of control and order.",
            "relationship_strength": 5,
            "relationship_keywords": "ideological conflict, rebellion"
        },
        {
            "source_entity": "Taylor",
            "target_entity": "The Device",
            "relationship_description": "Taylor shows reverence towards the device, indicating its importance and potential impact.",
            "relationship_strength": 9,
            "relationship_keywords": "reverence, technological significance"
        }
    ]
}

---真正的数据---

Entity_types: [${entityTypes}]
Text: ${inputText}

Output:
`

export { entityExtraction }
