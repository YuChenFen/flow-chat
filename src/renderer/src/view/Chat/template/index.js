class Template {
    // 实体提取
    static getNodeTemplate(__QUERY__) {
        return [
            {
                role: 'user',
                content: `你是一个实体提取的专家，能够准确提取句子中的实体。

如：
阿罗娜和普拉娜是什么关系？

你的回复为：
阿罗娜,普拉娜

以下是我写的句子，请帮我找出里面的所有实体，回答中不要有多余的其他内容：
${__QUERY__}`
            }
        ]
    }

    // 图谱询问
    static chartTemplate(__INFO__, __QUERY__) {
        return [
            {
                role: 'system',
                content:
                    '你是一个知识图谱问答机器人，用户会给你提供一个表格和一个问题，你需要根据表格和问题回答用户问题。确保准确回答问题，不要编造答案。'
            },
            {
                role: 'user',
                content: `你是一个问答机器人。你的任务是根据给定的已知信息回答用户问题。
已知信息是两个表格：
1. 一个是节点表格，每行有一个节点的信息，节点里面有名称和内容，名称代表着这个节点的名字，内容是这个实体的详细描述
2. 一个是关系表格，每行有一个关系的信息，关系里面有源节点，目标节点，关系名称，关系内容，代表着源节点和目标节点之间的关系，也就是说源节点是目标节点的关系名称，关系内容描述着这个关系的具体描述。
3. 节点和关系都是部分信息，你需要根据这些信息准确的回答用户问题，不要编造答案。如果下述已知信息不足以回答用户问题，请直接回复“我无法回答您的问题”。
4. 确保你的回复完全依据下述已知信息，不要编造答案。如果下述已知信息不足以回答用户问题，请直接回复“我无法回答您的问题”。

已知信息：
${__INFO__}

用户问：
${__QUERY__}

请用中文回答问题。
`
            }
        ]
    }

    // 文档询问
    static textTemplate(__INFO__, __QUERY__) {
        return [
            {
                role: 'system',
                content:
                    '你是一个问答机器人，用户会给你提供一些数据和一个问题，你需要根据数据和问题回答用户问题。确保准确回答问题，不要编造答案。'
            },
            {
                role: 'user',
                content: `你是一个问答机器人。你的任务是根据给定的已知信息回答用户问题。确保你的回复完全依据下述已知信息，不要编造答案。如果下述已知信息不足以回答用户问题，请直接回复“我无法回答您的问题”。

已知信息：
${__INFO__}

问题：
${__QUERY__}`
            }
        ]
    }
}

export default Template
