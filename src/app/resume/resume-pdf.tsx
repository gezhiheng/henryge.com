/* eslint-disable react-refresh/only-export-components */
import type { ResumeProject, ResumeProjectLink } from './resume-data'
import path from 'node:path'
import process from 'node:process'
import {
  Document,
  Font,
  Link,
  Page,
  renderToBuffer,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer'
import resumeData from './resume-data'

Font.register({
  family: 'ResumeBody',
  src: path.join(process.cwd(), 'public/fonts/NotoSansSC-Body.ttf'),
})

Font.register({
  family: 'ResumeRegular',
  src: path.join(process.cwd(), 'public/fonts/NotoSansSC-Regular.ttf'),
})

Font.register({
  family: 'ResumeBold',
  src: path.join(process.cwd(), 'public/fonts/NotoSansSC-Bold.ttf'),
})

const emphasizedTerms = [
  '40%+',
  '1分43秒',
  '15秒',
  '1 秒内',
  '200+',
  '6 个 npm 包',
  '468 个面部关键点',
]

const emphasizedPattern = new RegExp(
  `(${emphasizedTerms.map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
  'g',
)

const styles = StyleSheet.create({
  page: {
    paddingTop: 28,
    paddingRight: 40,
    paddingBottom: 28,
    paddingLeft: 40,
    fontFamily: 'ResumeRegular',
    fontSize: 9.3,
    lineHeight: 1.5,
    color: '#444',
  },
  header: {
    marginBottom: 0,
  },
  name: {
    fontSize: 19.5,
    fontFamily: 'ResumeBold',
    lineHeight: 1.25,
    color: '#202124',
  },
  nameRule: {
    marginTop: 3,
    marginBottom: 5,
    borderBottomWidth: 0.6,
    borderBottomColor: '#e4e4e4',
  },
  headerSpacer: {
    height: 0,
  },
  title: {
    fontSize: 10,
    lineHeight: 1.4,
    color: '#4b4b4b',
    marginBottom: 3,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  contactText: {
    marginRight: 8,
    fontSize: 8.8,
    color: '#555',
  },
  contactLink: {
    marginRight: 8,
    fontSize: 8.8,
    color: '#1a56db',
    textDecoration: 'none',
  },
  section: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 13.5,
    fontFamily: 'ResumeBold',
    lineHeight: 1.2,
    color: '#202124',
  },
  sectionRule: {
    marginTop: 3,
    marginBottom: 5.5,
    borderBottomWidth: 0.6,
    borderBottomColor: '#dcdcdc',
  },
  skillGroup: {
    flexDirection: 'row',
    marginBottom: 4.5,
  },
  skillCategory: {
    width: 62,
    fontSize: 9.3,
    color: '#252525',
  },
  skillItems: {
    flex: 1,
    fontSize: 9.3,
    color: '#555',
  },
  experience: {
    marginBottom: 8,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2.2,
  },
  experienceCompany: {
    fontSize: 9.8,
    fontFamily: 'ResumeBold',
    color: '#202124',
  },
  experienceDate: {
    fontSize: 9.2,
    color: '#555',
  },
  experienceDesc: {
    fontSize: 9.2,
    lineHeight: 1.5,
    color: '#555',
  },
  project: {
    marginBottom: 9.5,
  },
  projectNameRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    marginBottom: 2.2,
  },
  projectName: {
    marginRight: 6,
    fontSize: 9.8,
    fontFamily: 'ResumeBold',
    color: '#202124',
  },
  projectInlineDesc: {
    marginRight: 6,
    fontSize: 9.2,
    color: '#333',
  },
  projectLink: {
    marginRight: 5,
    fontSize: 8.8,
    color: '#1a56db',
    textDecoration: 'none',
  },
  projectTech: {
    marginBottom: 3.5,
    fontSize: 8.7,
    lineHeight: 1.45,
    color: '#666',
  },
  highlight: {
    flexDirection: 'row',
    marginBottom: 3.8,
    paddingLeft: 16,
  },
  bullet: {
    width: 10,
    fontSize: 8.9,
    color: '#333',
  },
  highlightText: {
    flex: 1,
    fontSize: 8.8,
    lineHeight: 1.5,
    color: '#555',
  },
  openSourceItem: {
    flexDirection: 'row',
    marginBottom: 5.5,
    paddingLeft: 16,
  },
  openSourceText: {
    flex: 1,
    fontSize: 9.2,
    lineHeight: 1.48,
    color: '#555',
  },
  openSourceLink: {
    fontSize: 8.8,
    color: '#1a56db',
    textDecoration: 'none',
  },
  education: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  educationSchool: {
    marginRight: 6,
    fontSize: 9.2,
    color: '#555',
  },
  educationText: {
    marginRight: 6,
    fontSize: 9.2,
    color: '#555',
  },
  strong: {
    fontFamily: 'ResumeBold',
    color: '#1f1f1f',
  },
})

function textWithHighlights(text: string) {
  const nodes: Array<string | React.ReactElement> = []
  let cursor = 0

  for (const match of text.matchAll(emphasizedPattern)) {
    const start = match.index ?? 0
    const value = match[0]

    if (start > cursor) {
      nodes.push(text.slice(cursor, start))
    }

    nodes.push(<Text key={`${value}-${start}`} style={styles.strong}>{value}</Text>)
    cursor = start + value.length
  }

  if (cursor < text.length) {
    nodes.push(text.slice(cursor))
  }

  return nodes
}

function linkLabel(link: ResumeProjectLink) {
  if (link.label) {
    return link.label
  }
  if (link.url.includes('github.com')) {
    return 'GitHub'
  }
  if (link.url.includes('npmjs.com')) {
    return 'npm'
  }
  if (link.url.includes('pipto.henryge.com')) {
    return '文档'
  }
  return '介绍'
}

function visibleHighlights(project: ResumeProject) {
  return project.highlights ?? []
}

function ResumeDocument() {
  const { profile, skills, experiences, projects, openSource, education } = resumeData

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header} wrap={false}>
          <Text style={styles.name}>{profile.name}</Text>
          <View style={styles.nameRule} />
          <View style={styles.headerSpacer} />
          <Text style={styles.title}>{profile.title}</Text>
        </View>

        <View style={styles.contactRow}>
          {profile.phone && <Text style={styles.contactText}>{profile.phone}</Text>}
          {profile.email && (
            <Link src={`mailto:${profile.email}`} style={styles.contactLink}>
              {profile.email}
            </Link>
          )}
          {profile.github && (
            <Link src={`https://${profile.github}`} style={styles.contactLink}>
              {profile.github}
            </Link>
          )}
          {profile.website && (
            <Link src={`https://${profile.website}`} style={styles.contactLink}>
              {profile.website}
            </Link>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>技术栈</Text>
          <View style={styles.sectionRule} />
          {skills.map(group => (
            <View key={group.category} style={styles.skillGroup}>
              <Text style={styles.skillCategory}>
                {group.category}
                ：
              </Text>
              <Text style={styles.skillItems}>{group.items.join('、')}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>工作经历</Text>
          <View style={styles.sectionRule} />
          {experiences.map(exp => (
            <View key={`${exp.company}-${exp.start}`} style={styles.experience} wrap={false}>
              <View style={styles.experienceHeader}>
                <Text style={styles.experienceCompany}>
                  {`${exp.company} | ${exp.position}`}
                </Text>
                <Text style={styles.experienceDate}>
                  {`${exp.start} ~ ${exp.end}`}
                </Text>
              </View>
              <Text style={styles.experienceDesc}>{textWithHighlights(exp.description)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>项目经历</Text>
          <View style={styles.sectionRule} />
          {projects.map(project => (
            <View key={project.name} style={styles.project}>
              <View style={styles.projectNameRow}>
                <Text style={styles.projectName}>{project.name}</Text>
                {project.description && (
                  <Text style={styles.projectInlineDesc}>{project.description}</Text>
                )}
                {project.links?.map(projLink => (
                  <Link key={projLink.url} src={projLink.url} style={styles.projectLink}>
                    {`| ${linkLabel(projLink)}`}
                  </Link>
                ))}
              </View>
              {project.techStack && (
                <Text style={styles.projectTech}>{project.techStack}</Text>
              )}
              {visibleHighlights(project).map(highlight => (
                <View key={highlight} style={styles.highlight}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.highlightText}>{textWithHighlights(highlight)}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>开源经历</Text>
          <View style={styles.sectionRule} />
          {openSource.map(item => (
            <View key={item.description} style={styles.openSourceItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.openSourceText}>
                {textWithHighlights(item.description)}
                {item.link && (
                  <Link src={item.link} style={styles.openSourceLink}>
                    {` | ${linkLabel({ url: item.link })}`}
                  </Link>
                )}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>教育经历</Text>
          <View style={styles.sectionRule} />
          {education.map(edu => (
            <View key={edu.school} style={styles.education}>
              <Text style={styles.educationText}>{edu.degree}</Text>
              <Text style={styles.educationSchool}>{edu.school}</Text>
              <Text style={styles.educationText}>{edu.major}</Text>
              <Text style={styles.educationText}>
                {`${edu.start} ~ ${edu.end}`}
              </Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  )
}

export async function renderResumePDF() {
  return renderToBuffer(<ResumeDocument />)
}
