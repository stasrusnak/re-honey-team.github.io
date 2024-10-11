import { ReactElement, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DecorativeLine from "../../components/DecorativeLine/DecorativeLine";
import Icons from "../../components/Icons/Icons";
import styles from "./MemberPage.module.css";
import Title from "../../components/Title/Title";
import ProjectCard from "../../components/ProjectCard/ProjectCard";
import HTHead, { Pages } from "../../components/HTHead/HTHead";
import data from "../../../htconfig.json";
import MemberSocials from "../../components/MemberSocials/MemberSocials";
import ErrorPage from "../ErrorPage/ErrorPage";
import { Member, Project } from "../../utils/config_type_alias";

export default function MemberPage(): ReactElement {
    const [members, setMembers] = useState([]);
    const [error, setError] = useState(true);
    const [currentMember, setCurrentMember] = useState();
    const [memberProjects, setMemberProjects] = useState([]);
    const params = useParams();

    const getMembers = () => {
        if (data.members) setMembers(data.members);
        else setError(true);
    };

    const getCurrentMember = () => {
        const member: Member | undefined = members.find((m: Member) => m.gh === params.name);

        if (member)
            member.socials = {gh: member.gh, ...member.socials};
        setCurrentMember(member);

        if (currentMember) setError(false);
        else setError(true);
    };

    const getProjects = () => {
        let projects = [];
        if (currentMember?.projects) {
            projects = currentMember.projects?.map((memberProject: string) =>
                data.projects.find(
                (currentProject) => currentProject.gh === memberProject
                )
            );
        }
        setMemberProjects(projects);
    };

    useEffect(() => getMembers(), []);
    useEffect(() => getCurrentMember(), [members, currentMember]);
    useEffect(() => { if (currentMember) getProjects(); }, [currentMember]);

    if (!error) {
        var s = { backgroundColor: "#262626" };
        if (currentMember?.banner) {
            if (currentMember.banner.startsWith("#")) {
                s = { backgroundColor: currentMember.banner };
            } else {
                s = {
                    backgroundImage: `url('${currentMember.banner}')`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "auto 300px",
                };
            }
        }
    }

    return (
        <>
            {error && (
                <ErrorPage/>
            )}
            {!error && (
                <>
                    <HTHead page={Pages.member} gh={currentMember.gh} />
                    <section className={styles["head-section"]} style={s}>
                        <div className={styles["avatar-wrapper"]}>
                            <img
                            className={styles["avatar"]}
                            src={`https://avatars.githubusercontent.com/${currentMember.gh}`}
                            />
                        </div>
                    </section>
                    <section className={styles["info-section"]}>
                        <h1 className={styles["info-section__title"]}>
                            {currentMember.gh}
                        </h1>
                        <div className={styles["info-section__stats"]}>
                            {currentMember?.bio && (
                                <p className={styles["bio"]}>{currentMember.bio} ・</p>
                            )}
                            {currentMember.langs?.map((lang: string) => {
                                return <Icons name={lang} key={lang} />;
                            })}
                        </div>
                        <div className={styles["contacts"]}>
                            <MemberSocials socials={currentMember.socials}/>
                        </div>
                        <DecorativeLine className={styles["dash"]} />
                    </section>
                    <section className={styles["projects-section"]}>
                        <div className="wrapper">
                            <Title className={styles["projects-section__title"]}>
                                Проекты
                            </Title>
                            <div className={styles["projects-wrapper"]}>
                                {memberProjects?.length > 0 &&
                                    memberProjects?.map((project, index) => {
                                        return <ProjectCard project={project} key={index} />;
                                    })
                                }
                                {memberProjects?.length === 0 && (
                                    <p>У этого участника еще нет проектов</p>
                                )}
                            </div>
                        </div>
                    </section>
                </>
            )}
        </>
    );
}